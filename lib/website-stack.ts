import { Construct, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';

export class WebsiteStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    const siteDomain = `${this.node.tryGetContext('subdomain')}.${this.node.tryGetContext('domain')}`;

    // S3 Bucket for hosting
    const websiteBucket = new Bucket(this, 'WebsiteBucket', {
      bucketName: siteDomain,
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,

      // Keep for all environments except production
      removalPolicy: RemovalPolicy.DESTROY
    });

    new BucketDeployment(this, 'DeployWebsite', {
      sources: [Source.asset('src')],
      destinationBucket: websiteBucket
    });
  }
}
