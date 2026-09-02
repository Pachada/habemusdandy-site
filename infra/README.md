# Kintook Site — Infrastructure

AWS CDK (TypeScript) for **production** marketing-site hosting in a single AWS
account: S3 (private) + CloudFront + ACM + GitHub OIDC deploy roles.

DNS stays at **Cloudflare** (required by Cloudflare Registrar). This stack does
**not** create a Route 53 hosted zone or records. You CNAME `kintook.com` and
`www.kintook.com` at Cloudflare to the CloudFront domain.

Same hosting pattern as `Habemusfisio-ui`, without a staging stack. This is a
multi-page Astro site, not an SPA. CloudFront serves real HTML routes and a
real `/404.html`.

| Git branch | GitHub Environment | Stack              | Site URL       |
| ---------- | ------------------ | ------------------ | -------------- |
| `main`     | `production`       | `KintookSiteStack` | `kintook.com`  |

## What the stack creates

| Resource                | Purpose                                                                 |
| ----------------------- | ----------------------------------------------------------------------- |
| S3 Bucket               | Compiled static assets (private, OAC-only access)                       |
| CloudFront Distribution | HTTPS, pretty-URL rewrite to `index.html`, hashed `/_astro/*` cache     |
| ACM Certificate         | `kintook.com` + `www.kintook.com` (you add validation CNAMEs in Cloudflare) |
| IAM OIDC Provider       | Import existing account provider (only one GitHub OIDC per account)     |
| AppDeployRole           | Least-privilege role for app deploys (S3 sync + CF invalidation)        |
| InfraDeployRole         | Elevated role for CDK deploys                                           |

**Estimated cost:** ~$1–2/month for typical marketing traffic.

---

## One-time setup

### 1. Prerequisites

- AWS CLI with admin credentials for this account
- Node.js 20+ (CDK) and Node.js 22+ (site build)
- AWS CDK bootstrapped in the account/region:

```bash
npx aws-cdk bootstrap aws://YOUR_ACCOUNT_ID/us-east-1
```

If you already created a Route 53 hosted zone for `kintook.com`, you can delete
it. It is unused.

### 2. `cdk.json`

GitHub OIDC is imported from the target account. `githubRepo` stays
`habemusdandy-site` until the GitHub repository is renamed.

```json
{
  "domainName": "kintook.com",
  "githubOrg": "Pachada",
  "githubRepo": "habemusdandy-site"
}
```

### 3. First deploy (local) + Cloudflare DNS

Chicken-and-egg: `InfraDeployRole` does not exist until the stack is created.
ACM also waits until Cloudflare has the validation CNAMEs.

```bash
cd infra
npm ci
npx cdk deploy KintookSiteStack
```

The deploy **pauses** on the ACM certificate. In another window:

1. AWS Console → Certificate Manager (us-east-1) → the pending `kintook.com` cert.
2. Copy both **CNAME name / CNAME value** pairs (apex and `www`).
3. In Cloudflare DNS for `kintook.com`, add each as a **CNAME**, **DNS only**
   (grey cloud, not proxied).

When ACM becomes Issued, the rest of the stack creates. Copy
`DistributionDomainName` from the outputs (`dxxxxx.cloudfront.net`).

4. In Cloudflare DNS, add (also **DNS only** / grey cloud):

   | Type  | Name | Target                         |
   | ----- | ---- | ------------------------------ |
   | CNAME | `@`  | `dxxxxx.cloudfront.net`        |
   | CNAME | `www`| `dxxxxx.cloudfront.net`        |

   Cloudflare flattens the apex CNAME. Do **not** orange-cloud (proxy) these
   records: TLS is on CloudFront with the ACM cert.

5. Remove any leftover A/AAAA records for `@` / `www` that would conflict.

Outputs:

```
KintookSiteStack.BucketName              = ...
KintookSiteStack.DistributionId          = ...
KintookSiteStack.DistributionDomainName  = dxxxxx.cloudfront.net
KintookSiteStack.CertificateArn          = arn:aws:acm:...
KintookSiteStack.AppDeployRoleArn        = arn:aws:iam::...:role/...
KintookSiteStack.InfraDeployRoleArn      = arn:aws:iam::...:role/...
KintookSiteStack.SiteUrl                 = https://kintook.com
```

### 4. GitHub Environment secrets

Create a GitHub Environment named `production`.

| Secret                              | Value                    |
| ----------------------------------- | ------------------------ |
| `AWS_ROLE_ARN`                      | `AppDeployRoleArn`       |
| `AWS_INFRA_ROLE_ARN`                | `InfraDeployRoleArn`     |
| `PROD_S3_BUCKET`                    | `BucketName`             |
| `PROD_CF_DISTRIBUTION_ID`           | `DistributionId`         |
| `PUBLIC_APP_ORIGIN` (var, optional) | Dashboard origin         |

OIDC trust is scoped to `environment:production` and workflow ref
`refs/heads/main`. Run **Deploy Infrastructure** from `main`.

### 5. Workflows

| Workflow           | When           |
| ------------------ | -------------- |
| `ci.yml`           | Pull requests  |
| `deploy-prod.yml`  | Push to `main` |
| `deploy-infra.yml` | Manual CDK     |

---

## Rollback

The bucket is **versioned**. Re-run **Deploy Production** from a known-good
commit, or restore prior HTML in S3 and invalidate `/*`.

```bash
cd infra
npx cdk diff KintookSiteStack
npx cdk synth
```
