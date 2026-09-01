#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { KintookSiteStack } from '../lib/kintook-site-stack'

const app = new cdk.App()

const domainName = app.node.tryGetContext('domainName') as string
const hostedZoneId = app.node.tryGetContext('hostedZoneId') as string
const hostedZoneName = app.node.tryGetContext('hostedZoneName') as string
const githubOrg = app.node.tryGetContext('githubOrg') as string
const githubRepo = app.node.tryGetContext('githubRepo') as string
const configuredOidcArn = app.node.tryGetContext('githubOidcProviderArn') as
  | string
  | undefined

const isPlaceholder = (value: string | undefined) =>
  !value || value.startsWith('YOUR_') || value.startsWith('ZXXX')

for (const [key, value] of Object.entries({
  domainName,
  hostedZoneId,
  hostedZoneName,
  githubOrg,
  githubRepo,
})) {
  if (isPlaceholder(value)) {
    throw new Error(
      `Context value "${key}" is not configured. Update cdk.json before deploying.`,
    )
  }
}

const account = process.env.CDK_DEFAULT_ACCOUNT
const oidcArnForAccount = `arn:aws:iam::${account}:oidc-provider/token.actions.githubusercontent.com`
const githubOidcProviderArn =
  configuredOidcArn && account && configuredOidcArn.includes(`::${account}:`)
    ? configuredOidcArn
    : account
      ? oidcArnForAccount
      : configuredOidcArn || undefined

new KintookSiteStack(app, 'KintookSiteStack', {
  env: {
    account,
    region: 'us-east-1',
  },
  domainName,
  hostedZoneId,
  hostedZoneName,
  githubOrg,
  githubRepo,
  githubOidcProviderArn,
  description: 'Kintook marketing site — production S3 + CloudFront',
})
