import { Construct, Stack, StackProps } from '@aws-cdk/core';

import { SiteBucket } from './s3/site-bucket';
import { SiteDistribution } from './cloud-front/site-distribution';
import { DNSRecord } from './route-53/dns-record';
import { SiteDeployment } from './deployment/site-deployment';

export class WebsiteStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const siteBucket = new SiteBucket(this, 'SiteBucket');
    const distribution = new SiteDistribution(this, 'SiteDistribution', { siteBucket: siteBucket.instance });
    
    new DNSRecord(this, 'SiteDNSRecord', { distribution: distribution.instance });
    
    new SiteDeployment(this, 'SiteDeployment', {
      bucket: siteBucket.instance,
      sourceCodeFolder: 'src',
      distribution: distribution.instance,
    });
  }
}
