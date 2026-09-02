import * as cdk from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as iam from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'

export interface KintookSiteStackProps extends cdk.StackProps {
  domainName: string
  githubOrg: string
  githubRepo: string
  /**
   * ARN of an existing GitHub OIDC provider in this account.
   * Only one provider per URL is allowed per AWS account.
   */
  githubOidcProviderArn?: string
}

export class KintookSiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: KintookSiteStackProps) {
    super(scope, id, props)

    cdk.Tags.of(this).add('DeployEnvironment', 'production')
    cdk.Tags.of(this).add('Project', 'Kintook')

    const githubEnvironment = 'production'
    const appDeployWorkflow = 'deploy-prod.yml'
    const infraDeployWorkflow = 'deploy-infra.yml'
    const oidcWorkflowRef = 'refs/heads/main'
    const wwwDomainName = `www.${props.domainName}`

    // DNS stays at Cloudflare Registrar. Validation CNAMEs are added there
    // while this deploy waits on ACM (see infra/README.md).
    const certificate = new acm.Certificate(this, 'Certificate', {
      domainName: props.domainName,
      subjectAlternativeNames: [wwwDomainName],
      validation: acm.CertificateValidation.fromDns(),
    })

    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      versioned: true,
    })

    const htmlCachePolicy = new cloudfront.CachePolicy(this, 'HtmlCachePolicy', {
      cachePolicyName: `${this.stackName}-HtmlNoCache`,
      defaultTtl: cdk.Duration.seconds(0),
      minTtl: cdk.Duration.seconds(0),
      maxTtl: cdk.Duration.seconds(0),
    })

    const origin = origins.S3BucketOrigin.withOriginAccessControl(siteBucket)

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
        responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.SECURITY_HEADERS,
      },
      additionalBehaviors: {
        '/_astro/*': {
          origin,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          compress: true,
          responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.SECURITY_HEADERS,
        },
      },
      domainNames: [props.domainName, wwwDomainName],
      certificate,
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
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
    })

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
            'token.actions.githubusercontent.com:sub': `repo:${props.githubOrg}/${props.githubRepo}:environment:${githubEnvironment}`,
            'token.actions.githubusercontent.com:job_workflow_ref': `${props.githubOrg}/${props.githubRepo}/.github/workflows/${appDeployWorkflow}@${oidcWorkflowRef}`,
          },
        },
      ),
      description:
        'Assumed by GitHub Actions (production) to sync site assets and invalidate CloudFront',
      maxSessionDuration: cdk.Duration.hours(1),
    })

    siteBucket.grantReadWrite(appDeployRole)
    siteBucket.grantDelete(appDeployRole)
    distribution.grantCreateInvalidation(appDeployRole)

    const infraDeployRole = new iam.Role(this, 'InfraDeployRole', {
      roleName: `${this.stackName}-InfraDeployRole`,
      assumedBy: new iam.WebIdentityPrincipal(
        githubOidcProvider.openIdConnectProviderArn,
        {
          StringEquals: {
            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
            'token.actions.githubusercontent.com:sub': `repo:${props.githubOrg}/${props.githubRepo}:environment:${githubEnvironment}`,
            'token.actions.githubusercontent.com:job_workflow_ref': `${props.githubOrg}/${props.githubRepo}/.github/workflows/${infraDeployWorkflow}@${oidcWorkflowRef}`,
          },
        },
      ),
      description:
        'Assumed by GitHub Actions (production) to run CDK deploy for infrastructure changes',
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
      description: 'Set as PROD_S3_BUCKET in the GitHub "production" environment',
    })
    new cdk.CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
      description: 'Set as PROD_CF_DISTRIBUTION_ID in the GitHub "production" environment',
    })
    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName,
      description:
        'Cloudflare CNAME target for @ and www (DNS only / grey cloud, not proxied)',
    })
    new cdk.CfnOutput(this, 'CertificateArn', {
      value: certificate.certificateArn,
      description:
        'ACM cert. While deploy waits, copy DNS validation CNAMEs from the ACM console into Cloudflare.',
    })
    new cdk.CfnOutput(this, 'AppDeployRoleArn', {
      value: appDeployRole.roleArn,
      description: 'Set as AWS_ROLE_ARN in the GitHub "production" environment',
    })
    new cdk.CfnOutput(this, 'InfraDeployRoleArn', {
      value: infraDeployRole.roleArn,
      description: 'Set as AWS_INFRA_ROLE_ARN in the GitHub "production" environment',
    })
    new cdk.CfnOutput(this, 'SiteUrl', {
      value: `https://${props.domainName}`,
      description: 'Live URL of the marketing site',
    })
  }
}
