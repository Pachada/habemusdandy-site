import * as cdk from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as targets from 'aws-cdk-lib/aws-route53-targets'
import { Construct } from 'constructs'

export interface HorayaSiteStackProps extends cdk.StackProps {
  /** GitHub Environment the deploy jobs run in: `production` or `staging`. */
  deployEnvironment: 'production' | 'staging'
  /**
   * Apex domain served by this stack (production only). Without it the stack
   * serves the CloudFront default domain and touches no DNS.
   */
  domainName?: string
  hostedZoneId?: string
  githubOrg: string
  githubRepo: string
  /**
   * `sub` claim prefix. This repo uses GitHub's immutable subject, so the
   * value includes the org and repo ids, not only the names. The roles trust
   * `<prefix>:environment:<deployEnvironment>` only.
   */
  githubSubjectPrefix: string
  /**
   * Git refs the deploy workflows may run from, matched against the OIDC
   * job_workflow_ref claim (StringLike, so `*` is allowed).
   * Production: release tags (refs/tags/v*). Staging: the trunk branches.
   */
  oidcWorkflowRefs: string[]
  /**
   * ARN of an existing GitHub OIDC provider in this account.
   * Only one provider per URL is allowed per AWS account.
   */
  githubOidcProviderArn?: string
}

/** Workflow that publishes the site (called by ci.yml for staging, dispatched on tags for prod). */
const APP_DEPLOY_WORKFLOW = 'deploy.yml'
/** Workflow that runs `cdk deploy` for this stack. */
const INFRA_DEPLOY_WORKFLOW = 'deploy-infra.yml'
/**
 * CloudFront serves this bucket prefix. deploy.yml copies a build into it; prod
 * releases are kept under releases/vX.Y.Z/ next to it and are never served.
 */
export const LIVE_ORIGIN_PATH = '/live'
/** Immutable prod release prefixes. The app deploy role can write but never delete them. */
export const RELEASES_PREFIX = 'releases/'

export class HorayaSiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: HorayaSiteStackProps) {
    super(scope, id, props)

    cdk.Tags.of(this).add('DeployEnvironment', props.deployEnvironment)
    cdk.Tags.of(this).add('Project', 'Horaya')

    if (props.oidcWorkflowRefs.length === 0) {
      throw new Error('oidcWorkflowRefs must list at least one ref.')
    }
    if (props.domainName && !props.hostedZoneId) {
      throw new Error('hostedZoneId is required with domainName.')
    }
    const isStaging = props.deployEnvironment === 'staging'
    const secretPrefix = isStaging ? 'STAGING' : 'PROD'
    const githubSubject = `${props.githubSubjectPrefix}:environment:${props.deployEnvironment}`
    const workflowRefs = (workflow: string) =>
      props.oidcWorkflowRefs.map(
        (ref) => `${props.githubOrg}/${props.githubRepo}/.github/workflows/${workflow}@${ref}`,
      )

    // Existing public zone in this account. Apex and www only.
    // staging-api.horaya.mx stays owned by the API stacks.
    const customDomain = props.domainName && props.hostedZoneId
      ? (() => {
          const domainName = props.domainName
          const zone = route53.HostedZone.fromHostedZoneAttributes(this, 'Zone', {
            hostedZoneId: props.hostedZoneId,
            zoneName: domainName,
          })
          const wwwDomainName = `www.${domainName}`
          const certificate = new acm.Certificate(this, 'Certificate', {
            domainName,
            subjectAlternativeNames: [wwwDomainName],
            validation: acm.CertificateValidation.fromDns(zone),
          })
          return { domainName, wwwDomainName, zone, certificate }
        })()
      : undefined

    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      versioned: true,
      // Overwritten live/ files leave noncurrent versions behind; drop them after 90 days.
      // Current objects never expire, so every releases/vX.Y.Z/ is kept for rollback.
      lifecycleRules: [{ noncurrentVersionExpiration: cdk.Duration.days(90) }],
    })

    const htmlCachePolicy = new cloudfront.CachePolicy(this, 'HtmlCachePolicy', {
      cachePolicyName: `${this.stackName}-HtmlNoCache`,
      defaultTtl: cdk.Duration.seconds(0),
      minTtl: cdk.Duration.seconds(0),
      maxTtl: cdk.Duration.seconds(0),
    })

    const origin = origins.S3BucketOrigin.withOriginAccessControl(siteBucket, {
      originPath: LIVE_ORIGIN_PATH,
    })

    // Staging must never be indexed; production keeps the managed security headers.
    const responseHeadersPolicy = isStaging
      ? new cloudfront.ResponseHeadersPolicy(this, 'StagingHeaders', {
          responseHeadersPolicyName: `${this.stackName}-StagingHeaders`,
          customHeadersBehavior: {
            customHeaders: [{ header: 'X-Robots-Tag', value: 'noindex, nofollow', override: true }],
          },
          securityHeadersBehavior: {
            contentTypeOptions: { override: true },
            frameOptions: { frameOption: cloudfront.HeadersFrameOption.SAMEORIGIN, override: true },
            referrerPolicy: {
              referrerPolicy: cloudfront.HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
              override: true,
            },
            strictTransportSecurity: {
              accessControlMaxAge: cdk.Duration.days(365),
              includeSubdomains: true,
              override: true,
            },
            xssProtection: { protection: true, modeBlock: true, override: true },
          },
        })
      : cloudfront.ResponseHeadersPolicy.SECURITY_HEADERS

    // Pretty URLs: /producto → /producto/index.html (Astro multi-page, not SPA).
    const rewriteToIndexHtml = new cloudfront.Function(this, 'RewriteToIndexHtml', {
      comment: 'Append index.html for directory-style Astro routes',
      code: cloudfront.FunctionCode.fromInline(`
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  if (uri.endsWith('/')) {
    request.uri += 'index.html';
  } else {
    var last = uri.split('/').pop();
    if (last && last.indexOf('.') === -1) {
      request.uri += '/index.html';
    }
  }
  return request;
}
`),
    })

    const rewriteAssociation: cloudfront.FunctionAssociation = {
      function: rewriteToIndexHtml,
      eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
    }

    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: htmlCachePolicy,
        compress: true,
        functionAssociations: [rewriteAssociation],
        responseHeadersPolicy,
      },
      additionalBehaviors: {
        '/_astro/*': {
          origin,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          compress: true,
          responseHeadersPolicy,
        },
      },
      ...(customDomain
        ? {
            domainNames: [customDomain.domainName, customDomain.wwwDomainName],
            certificate: customDomain.certificate,
            minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
          }
        : {}),
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 404,
          responsePagePath: '/404.html',
          ttl: cdk.Duration.seconds(0),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 404,
          responsePagePath: '/404.html',
          ttl: cdk.Duration.seconds(0),
        },
      ],
    })

    if (customDomain) {
      const { zone } = customDomain
      const alias = route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution))

      new route53.ARecord(this, 'ApexA', { zone, target: alias })
      new route53.AaaaRecord(this, 'ApexAaaa', { zone, target: alias })
      new route53.ARecord(this, 'WwwA', { zone, recordName: 'www', target: alias })
      new route53.AaaaRecord(this, 'WwwAaaa', { zone, recordName: 'www', target: alias })
    }

    const githubOidcProvider = props.githubOidcProviderArn
      ? iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(
          this,
          'GithubOidcProvider',
          props.githubOidcProviderArn,
        )
      : new iam.OpenIdConnectProvider(this, 'GithubOidcProvider', {
          url: 'https://token.actions.githubusercontent.com',
          clientIds: ['sts.amazonaws.com'],
          thumbprints: ['6938fd4d98bab03faadb97b34396831e3780aea1'],
        })

    const appDeployRole = new iam.Role(this, 'AppDeployRole', {
      roleName: `${this.stackName}-AppDeployRole`,
      assumedBy: new iam.WebIdentityPrincipal(
        githubOidcProvider.openIdConnectProviderArn,
        {
          StringEquals: {
            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
          },
          StringLike: {
            'token.actions.githubusercontent.com:sub': githubSubject,
            'token.actions.githubusercontent.com:job_workflow_ref': workflowRefs(APP_DEPLOY_WORKFLOW),
          },
        },
      ),
      description: `Assumed by GitHub Actions (${props.deployEnvironment}) to publish site builds and invalidate CloudFront`,
      maxSessionDuration: cdk.Duration.hours(1),
    })

    siteBucket.grantReadWrite(appDeployRole)
    siteBucket.grantDelete(appDeployRole)
    // Rollback targets: a release prefix can be written but never deleted by a deploy.
    appDeployRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.DENY,
        actions: ['s3:DeleteObject', 's3:DeleteObjectVersion'],
        resources: [siteBucket.arnForObjects(`${RELEASES_PREFIX}*`)],
      }),
    )
    distribution.grantCreateInvalidation(appDeployRole)
    // deploy.yml waits for the invalidation before its smoke check.
    distribution.grant(appDeployRole, 'cloudfront:GetInvalidation')

    const infraDeployRole = new iam.Role(this, 'InfraDeployRole', {
      roleName: `${this.stackName}-InfraDeployRole`,
      assumedBy: new iam.WebIdentityPrincipal(
        githubOidcProvider.openIdConnectProviderArn,
        {
          StringEquals: {
            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
          },
          StringLike: {
            'token.actions.githubusercontent.com:sub': githubSubject,
            'token.actions.githubusercontent.com:job_workflow_ref': workflowRefs(INFRA_DEPLOY_WORKFLOW),
          },
        },
      ),
      description: `Assumed by GitHub Actions (${props.deployEnvironment}) to run CDK deploy for infrastructure changes`,
      maxSessionDuration: cdk.Duration.hours(1),
    })

    infraDeployRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('PowerUserAccess'),
    )
    infraDeployRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['iam:*'],
        resources: [`arn:aws:iam::${this.account}:role/${this.stackName}-*`],
      }),
    )
    infraDeployRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['iam:GetRole', 'iam:PassRole', 'sts:AssumeRole'],
        resources: [`arn:aws:iam::${this.account}:role/cdk-*`],
      }),
    )

    new cdk.CfnOutput(this, 'BucketName', {
      value: siteBucket.bucketName,
      description: `Set as ${secretPrefix}_S3_BUCKET in the GitHub "${props.deployEnvironment}" environment`,
    })
    new cdk.CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
      description: `Set as ${secretPrefix}_CF_DISTRIBUTION_ID in the GitHub "${props.deployEnvironment}" environment`,
    })
    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName,
      description: customDomain
        ? 'CloudFront domain. Apex and www alias to it from the horaya.mx zone.'
        : 'CloudFront domain. This stack serves it directly; set it as SITE_URL (with https://).',
    })
    if (customDomain) {
      new cdk.CfnOutput(this, 'CertificateArn', {
        value: customDomain.certificate.certificateArn,
        description: `ACM certificate for ${customDomain.domainName} and ${customDomain.wwwDomainName}`,
      })
    }
    new cdk.CfnOutput(this, 'AppDeployRoleArn', {
      value: appDeployRole.roleArn,
      description: `Set as AWS_ROLE_ARN in the GitHub "${props.deployEnvironment}" environment`,
    })
    new cdk.CfnOutput(this, 'InfraDeployRoleArn', {
      value: infraDeployRole.roleArn,
      description: `Set as AWS_INFRA_ROLE_ARN in the GitHub "${props.deployEnvironment}" environment`,
    })
    new cdk.CfnOutput(this, 'SiteUrl', {
      value: `https://${customDomain?.domainName ?? distribution.distributionDomainName}`,
      description: `URL of the ${props.deployEnvironment} marketing site (SITE_URL in that GitHub environment)`,
    })
  }
}
