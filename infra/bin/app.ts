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

new HorayaSiteStack(app, 'HorayaSiteStack', {
  env: {
    account,
    region,
  },
  domainName,
  hostedZoneId,
  githubOrg,
  githubRepo,
  githubOidcProviderArn,
  description: 'Horaya marketing site — production S3 + CloudFront',
})
