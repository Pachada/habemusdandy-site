# Horaya Site — Infrastructure

AWS CDK (TypeScript) for the marketing site in the Horaya account
`651694720404` (`us-east-1`): private S3, CloudFront, ACM, and GitHub OIDC
deploy roles.

DNS is the existing public Route 53 zone `horaya.mx`
(`Z06435213BPCSRDX9SAUG`). This stack does not create that zone. It writes
the ACM validation records and the apex / `www` alias records. It does not
touch `staging-api.horaya.mx` or `app.horaya.mx`.

This is a multi-page Astro site. CloudFront serves real HTML routes and a
real `/404.html`, from the bucket's `live/` prefix only. Production release
builds are kept next to it under `releases/vX.Y.Z/`. See
[`docs/releases.md`](../docs/releases.md).

| Deploys from                      | GitHub Environment | Stack                    | Site URL                  |
| --------------------------------- | ------------------ | ------------------------ | ------------------------- |
| `main`, `release/vX.Y` (and tags) | `staging`          | `HorayaSiteStagingStack` | CloudFront default domain |
| `vX.Y.Z` tags only                | `production`       | `HorayaSiteStack`        | `horaya.mx`               |

Staging has no custom domain and touches no DNS. It sends
`X-Robots-Tag: noindex, nofollow`.

## What the stack creates

| Resource                | Purpose                                                          |
| ----------------------- | ---------------------------------------------------------------- |
| S3 Bucket               | `live/` (served) and `releases/vX.Y.Z/` (rollback), private, OAC-only |
| CloudFront Distribution | HTTPS, pretty-URL rewrite to `index.html`, hashed `/_astro/*` cache |
| ACM Certificate         | Production only: `horaya.mx` + `www.horaya.mx`                   |
| Route 53 aliases        | Production only: apex and `www`, A and AAAA, to CloudFront       |
| IAM OIDC Provider       | Import of the account's existing GitHub OIDC provider            |
| AppDeployRole           | Site deploys: S3 write, CF invalidation. Cannot delete `releases/*` |
| InfraDeployRole         | Elevated role for CDK deploys                                    |

CDK is already bootstrapped in this account (`CDKToolkit`).

## Context

```json
{
  "domainName": "horaya.mx",
  "hostedZoneId": "Z06435213BPCSRDX9SAUG",
  "githubOrg": "Pachada",
  "githubRepo": "habemusdandy-site",
  "githubSubjectPrefix": "repo:Pachada@58006056/habemusdandy-site@1336594326"
}
```

The stack account is pinned to `651694720404`. Deploy with
`AWS_PROFILE=horaya`.

## Deploy

```bash
cd infra
npm ci
AWS_PROFILE=horaya npx cdk deploy HorayaSiteStagingStack
AWS_PROFILE=horaya npx cdk deploy HorayaSiteStack
```

Before the first production deploy of this version of the stack, do the
one-time cutover below.

ACM validation records are created in the zone, so the deploy does not pause
for a manual CNAME. When it finishes, `https://horaya.mx` and
`https://www.horaya.mx` both serve the distribution.

Outputs:

```
HorayaSiteStack.BucketName              = ...
HorayaSiteStack.DistributionId          = ...
HorayaSiteStack.DistributionDomainName  = dxxxxx.cloudfront.net
HorayaSiteStack.CertificateArn          = arn:aws:acm:...
HorayaSiteStack.AppDeployRoleArn        = arn:aws:iam::...:role/...
HorayaSiteStack.InfraDeployRoleArn      = arn:aws:iam::...:role/...
HorayaSiteStack.SiteUrl                 = https://horaya.mx
```

## GitHub Environment secrets

| Name                         | Kind   | `staging`                    | `production`         |
| ---------------------------- | ------ | ---------------------------- | -------------------- |
| `AWS_ROLE_ARN`               | secret | staging `AppDeployRoleArn`   | `AppDeployRoleArn`   |
| `AWS_INFRA_ROLE_ARN`         | secret | staging `InfraDeployRoleArn` | `InfraDeployRoleArn` |
| `STAGING_S3_BUCKET`          | secret | staging `BucketName`         | —                    |
| `STAGING_CF_DISTRIBUTION_ID` | secret | staging `DistributionId`     | —                    |
| `PROD_S3_BUCKET`             | secret | —                            | `BucketName`         |
| `PROD_CF_DISTRIBUTION_ID`    | secret | —                            | `DistributionId`     |
| `SITE_URL`                   | var    | staging `SiteUrl` (required) | optional, defaults to `https://horaya.mx` |
| `PUBLIC_APP_ORIGIN`          | var    | optional, defaults to `https://staging-app.horaya.mx` | optional, defaults to `https://app.horaya.mx` |

OIDC trust is this repo's immutable subject plus the environment
(`repo:Pachada@58006056/habemusdandy-site@1336594326:environment:<env>`), the
workflow file, and the ref. Production trusts `refs/tags/v*` only. Staging
trusts `main`, `release/v*` and tags.

## Workflows

| Workflow           | When                                                           |
| ------------------ | -------------------------------------------------------------- |
| `ci.yml`           | Pull requests; pushes to `main` / `release/vX.Y`, then staging |
| `release.yml`      | Manual: tag, GitHub Release, dispatch the production deploy    |
| `deploy.yml`       | Staging from CI; production from a tag; rollback               |
| `deploy-infra.yml` | Manual CDK (`target=staging` on `main`, `production` on a tag) |

## One-time cutover to tag releases

Production served the bucket root. This stack serves `live/`, so copy the root
there **before** deploying it, or the site returns 404 until the first release.
Run it before this change is merged, in this order:

```bash
export AWS_PROFILE=horaya
BUCKET=<PROD_S3_BUCKET>
# 0. Stop the old push-to-main prod deploy. Its `s3 sync --delete` on the bucket
#    root would delete live/ if anything merged to main during the cutover.
gh workflow disable deploy-prod.yml
# 1. Serve the current site from live/ (S3-to-S3 copies keep Cache-Control).
#    Run it right before step 2 so live/ matches what is served now.
aws s3 sync "s3://$BUCKET/" "s3://$BUCKET/live/" --exclude 'live/*' --exclude 'releases/*'
# 2. Point CloudFront at live/ and update the roles.
cd infra && npx cdk deploy HorayaSiteStack
# 3. Staging stack; fill in the staging environment from its outputs.
npx cdk deploy HorayaSiteStagingStack
```

4. In GitHub, **Settings → Environments → production → Deployment branches and
   tags**: choose *Selected branches and tags* and add the tag rule `v*`. Until
   then any ref's job can read the production secrets; only the OIDC role trust
   (deploy workflows at `refs/tags/v*`) limits AWS access.
5. Optionally, a tag ruleset on `v*` so only release automation and admins can
   create or delete release tags.

The root objects stay in the bucket but are no longer served. Remove them
after `v1.0.0` is live if you want a clean bucket. Anything merged to `main`
after step 0 reaches production only with the first release (`v1.0.0`).

## Rollback

```bash
gh workflow run deploy.yml --ref v1.2.3 -f environment=production
```

See [`docs/releases.md`](../docs/releases.md#roll-back). To preview an infra change:

```bash
cd infra
AWS_PROFILE=horaya npx cdk diff HorayaSiteStack
```
