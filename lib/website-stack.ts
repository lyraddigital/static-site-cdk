import { Construct, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';

export class WebsiteStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    const domain = "lyraddigital.com";
    const subdomain = "test";

    const siteDomain = `${subdomain}.${domain}`;

    // S3 Bucket for hosting
    new Bucket(this, 'WebsiteBucket', {
      bucketName: siteDomain,
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,

      // Keep for all environments except production
      removalPolicy: RemovalPolicy.DESTROY
    });
  }
}
