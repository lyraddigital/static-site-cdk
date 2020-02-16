import { Construct, Stack, StackProps } from '@aws-cdk/core';

import { SiteDomainProps } from './props/site-domain-props';
import { SiteBucket } from './s3/site-bucket';
import { WebsiteDeployment } from './deployment/website-deployment';
import { Distribution } from './cloud-front/distribution';
import { DNSRecord } from './route-53/dns-record';

export class WebsiteStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const siteBucket = this.getWebsiteBucket();
    const distribution = this.getDistribution(siteBucket);
    
    this.ensureDNS(distribution);
    this.deployWebsiteCode(siteBucket, distribution);
  }

  private getWebsiteBucket(): SiteBucket {
    return new SiteBucket(this, 'SiteBucket', this.getDomainProperties());
  }

  private getDistribution(siteBucket: SiteBucket): Distribution {
    const { rootDomain: domainName } = this.getDomainProperties();
    
    return new Distribution(this, 'SiteDistribution', { domainName, siteBucket: siteBucket.instance });
  }

  private ensureDNS(distribution: Distribution) {
    new DNSRecord(this, 'SiteDNSRecord', {
      domainName: this.getDomainProperties().rootDomain,
      distribution: distribution.instance
    });
  }

  private deployWebsiteCode(siteBucket: SiteBucket, distribution: Distribution) {
    new WebsiteDeployment(this, 'SiteDeployment', {
      bucket: siteBucket.instance,
      sourceCodeFolder: 'src',
      distribution: distribution.instance,
    });
  }

  private getDomainProperties(): SiteDomainProps {
    return {
      rootDomain: this.node.tryGetContext('subdomain'),
      subDomain: this.node.tryGetContext('domain')
    };
  }
}
