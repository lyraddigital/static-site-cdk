import { CfnParameter, Construct, Stack, StackProps } from '@aws-cdk/core';

import { SiteBucket } from './constructs/site-bucket';
import { SiteDistribution } from './constructs/site-distribution';
import { DNSRecord } from './constructs/dns-record';
import { SiteDeployment } from './constructs/site-deployment';

export class WebsiteStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const domainName = new CfnParameter(this, 'hostedZoneName', {
      type: 'String',
      description: 'The name of the hosted zone that is registered as a in Route53 in your account'
    });

    const subDomain =  new CfnParameter(this, 'subDomainName', {
      type: 'String',
      description: 'The name of the sub domain that will be set as an alias record in Route53 and be used by Cloudfront'
    });

    const domainProps = { rootDomain: domainName.valueAsString, subDomain: subDomain.valueAsString };

    const siteBucket = new SiteBucket(this, 'SiteBucket', domainProps);
    const distribution = new SiteDistribution(this, 'SiteDistribution', { ...domainProps, siteBucket: siteBucket.instance });
    
    new DNSRecord(this, 'SiteDNSRecord', { ...domainProps, distribution: distribution.instance });
    
    new SiteDeployment(this, 'SiteDeployment', {
      bucket: siteBucket.instance,
      sourceCodeFolder: 'src',
      distribution: distribution.instance,
    });
  }
}
