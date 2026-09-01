# Kintook Site — Infrastructure

AWS CDK (TypeScript) for **production** marketing-site hosting in a single AWS
account: S3 (private) + CloudFront + custom domain + GitHub OIDC deploy roles.

Same pattern as `Habemusfisio-ui`, without a staging stack. This is a multi-page
Astro site, not an SPA. CloudFront serves real HTML routes and a real
`/404.html`.

| Git branch | GitHub Environment | Stack              | Site URL       |
| ---------- | ------------------ | ------------------ | -------------- |
| `main`     | `production`       | `KintookSiteStack` | `kintook.com`  |

## What the stack creates

| Resource                | Purpose                                                                 |
| ----------------------- | ----------------------------------------------------------------------- |
| S3 Bucket               | Compiled static assets (private, OAC-only access)                       |
| CloudFront Distribution | HTTPS, pretty-URL rewrite to `index.html`, hashed `/_astro/*` cache     |
| ACM Certificate         | `kintook.com` (DNS-validated)                                           |
| Route 53 A Record       | ALIAS to CloudFront                                                     |
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

### 2. Configure `cdk.json`

Set the Route 53 hosted zone ID for `kintook.com`. GitHub OIDC is imported from
the target account (`arn:aws:iam::<account>:oidc-provider/token.actions.githubusercontent.com`).
`githubRepo` stays `habemusdandy-site` until the GitHub repository is renamed.

```json
{
  "domainName": "kintook.com",
  "hostedZoneId": "ZXXXXXXXXXXXXX",
  "hostedZoneName": "kintook.com",
  "githubOrg": "Pachada",
  "githubRepo": "habemusdandy-site"
}
```

### 3. First deploy (local)

Chicken-and-egg: `InfraDeployRole` does not exist until the stack is created.

```bash
cd infra
npm ci

npx cdk diff KintookSiteStack
npx cdk deploy KintookSiteStack
```

Outputs:

```
KintookSiteStack.BucketName         = ...
KintookSiteStack.DistributionId     = ...
KintookSiteStack.AppDeployRoleArn   = arn:aws:iam::...:role/...
KintookSiteStack.InfraDeployRoleArn = arn:aws:iam::...:role/...
KintookSiteStack.SiteUrl            = https://kintook.com
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

| Workflow          | When                |
| ----------------- | ------------------- |
| `ci.yml`          | Pull requests       |
| `deploy-prod.yml` | Push to `main`      |
| `deploy-infra.yml`| Manual CDK          |

---

## Rollback

The bucket is **versioned**. Re-run **Deploy Production** from a known-good
commit, or restore prior HTML in S3 and invalidate `/*`.

```bash
cd infra
npx cdk diff KintookSiteStack
npx cdk synth
```
