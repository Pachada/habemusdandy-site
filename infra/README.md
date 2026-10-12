# Horaya Site — Infrastructure

AWS CDK (TypeScript) for the marketing site in the Horaya account
`651694720404` (`us-east-1`): private S3, CloudFront, ACM, and GitHub OIDC
deploy roles.

DNS is the existing public Route 53 zone `horaya.mx`
(`Z06435213BPCSRDX9SAUG`). This stack does not create that zone. It writes
the ACM validation records and the apex / `www` alias records. It does not
touch `staging-api.horaya.mx` or `app.horaya.mx`.

There is no staging stack. This is a multi-page Astro site. CloudFront
serves real HTML routes and a real `/404.html`.

| Git branch | GitHub Environment | Stack              | Site URL     |
| ---------- | ------------------ | ------------------ | ------------ |
| `main`     | `production`       | `HorayaSiteStack`  | `horaya.mx`  |

## What the stack creates

| Resource                | Purpose                                                          |
| ----------------------- | ---------------------------------------------------------------- |
| S3 Bucket               | Compiled static assets (private, OAC-only access)                |
| CloudFront Distribution | HTTPS, pretty-URL rewrite to `index.html`, hashed `/_astro/*` cache |
| ACM Certificate         | `horaya.mx` + `www.horaya.mx`, validated in the existing zone    |
| Route 53 aliases        | Apex and `www`, A and AAAA, to CloudFront                        |
| IAM OIDC Provider       | Import of the account's existing GitHub OIDC provider            |
| AppDeployRole           | Least-privilege role for app deploys (S3 sync + CF invalidation) |
| InfraDeployRole         | Elevated role for CDK deploys                                    |

CDK is already bootstrapped in this account (`CDKToolkit`).

## Context

```json
{
  "domainName": "horaya.mx",
  "hostedZoneId": "Z06435213BPCSRDX9SAUG",
  "githubOrg": "Pachada",
  "githubRepo": "habemusdandy-site"
}
```

The stack account is pinned to `651694720404`. Deploy with
`AWS_PROFILE=horaya`.

## Deploy

```bash
cd infra
npm ci
AWS_PROFILE=horaya npx cdk deploy HorayaSiteStack
```

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

Environment name: `production`.

| Secret                              | Value                    |
| ----------------------------------- | ------------------------ |
| `AWS_ROLE_ARN`                      | `AppDeployRoleArn`       |
| `AWS_INFRA_ROLE_ARN`                | `InfraDeployRoleArn`     |
| `PROD_S3_BUCKET`                    | `BucketName`             |
| `PROD_CF_DISTRIBUTION_ID`           | `DistributionId`         |
| `PUBLIC_APP_ORIGIN` (var, optional) | `https://app.horaya.mx`  |

OIDC trust is this repo's immutable subject
(`repo:Pachada@58006056/habemusdandy-site@1336594326:*`) plus the workflow file.
Update these secrets only after this Horaya code is on `main`. Until then, a
push of the previous site would publish the old brand into the new bucket.

## Workflows

| Workflow           | When           |
| ------------------ | -------------- |
| `ci.yml`           | Pull requests  |
| `deploy-prod.yml`  | Push to `main` |
| `deploy-infra.yml` | Manual CDK     |

## Rollback

The bucket is versioned. Re-run **Deploy Production** from a known-good
commit, or restore prior HTML in S3 and invalidate `/*`.

```bash
cd infra
AWS_PROFILE=horaya npx cdk diff HorayaSiteStack
```
