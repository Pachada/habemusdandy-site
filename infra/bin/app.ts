#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { HorayaSiteStack } from '../lib/horaya-site-stack'

const app = new cdk.App()

const account = '651694720404'
const region = 'us-east-1'

const domainName = app.node.tryGetContext('domainName') as string
const hostedZoneId = app.node.tryGetContext('hostedZoneId') as string
const githubOrg = app.node.tryGetContext('githubOrg') as string
const githubRepo = app.node.tryGetContext('githubRepo') as string
const githubSubjectPrefix = app.node.tryGetContext('githubSubjectPrefix') as string
const configuredOidcArn = app.node.tryGetContext('githubOidcProviderArn') as
  | string
  | undefined

const isPlaceholder = (value: string | undefined) =>
  !value || value.startsWith('YOUR_') || value.startsWith('ZXXX')

for (const [key, value] of Object.entries({
  domainName,
  hostedZoneId,
  githubOrg,
  githubRepo,
  githubSubjectPrefix,
})) {
  if (isPlaceholder(value)) {
    throw new Error(
      `Context value "${key}" is not configured. Update cdk.json before deploying.`,
    )
  }
}

const githubOidcProviderArn =
  configuredOidcArn && configuredOidcArn.includes(`::${account}:`)
    ? configuredOidcArn
    : `arn:aws:iam::${account}:oidc-provider/token.actions.githubusercontent.com`

const shared = {
  env: { account, region },
  githubOrg,
  githubRepo,
  githubSubjectPrefix,
  githubOidcProviderArn,
}

new HorayaSiteStack(app, 'HorayaSiteStack', {
  ...shared,
  deployEnvironment: 'production',
  domainName,
  hostedZoneId,
  // Production deploys only from release tags (the GitHub environment is restricted to v* too).
  oidcWorkflowRefs: ['refs/tags/v*'],
  description: 'Horaya marketing site — production S3 + CloudFront',
})

new HorayaSiteStack(app, 'HorayaSiteStagingStack', {
  ...shared,
  deployEnvironment: 'staging',
  // Trunk branches, plus tags so a release can be redeployed to staging.
  oidcWorkflowRefs: ['refs/heads/main', 'refs/heads/release/v*', 'refs/tags/v*'],
  description: 'Horaya marketing site — staging S3 + CloudFront (CloudFront default domain)',
})
