import { Construct, Stack, StackProps } from '@aws-cdk/core';

import { SiteBucket } from './s3/site-bucket';
import { Distribution } from './cloud-front/distribution';
import { DNSRecord } from './route-53/dns-record';
import { WebsiteDeployment } from './deployment/website-deployment';

export class WebsiteStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const siteBucket = new SiteBucket(this, 'SiteBucket');
    const distribution = new Distribution(this, 'SiteDistribution', { siteBucket: siteBucket.instance });
    
    new DNSRecord(this, 'SiteDNSRecord', { distribution: distribution.instance });
    
    new WebsiteDeployment(this, 'SiteDeployment', {
      bucket: siteBucket.instance,
      sourceCodeFolder: 'src',
      distribution: distribution.instance,
    });
  }
}
