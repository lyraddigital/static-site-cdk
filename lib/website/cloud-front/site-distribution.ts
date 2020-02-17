import { Construct } from '@aws-cdk/core';
import { HostedZone } from '@aws-cdk/aws-route53';
import { DnsValidatedCertificate } from '@aws-cdk/aws-certificatemanager';
import { CloudFrontWebDistribution, SecurityPolicyProtocol, SSLMethod } from '@aws-cdk/aws-cloudfront';

import { SiteDistributionProps } from './site-distribution-props';
import { DomainSettingsService } from '../common/domain-settings.service';

export class SiteDistribution extends Construct {
    public instance: CloudFrontWebDistribution;

    constructor(parent: Construct, id: string, props: SiteDistributionProps) {
        super(parent, id);

        const domainSettings = DomainSettingsService.getSettingsFromContext(this);

        // Certificate Preparation
        const zone = HostedZone.fromLookup(this, 'Zone', { domainName: domainSettings.rootDomain });
        const certificate = new DnsValidatedCertificate(this, 'WebsiteCertificate', {
            domainName: domainSettings.rootDomain,
            hostedZone: zone
        });

        // Creating the Distribution
        this.instance = new CloudFrontWebDistribution(this, 'WebsiteDistribution', {
            aliasConfiguration: {
                acmCertRef: certificate.certificateArn,
                names: [ domainSettings.rootDomain ],
                sslMethod: SSLMethod.SNI,
                securityPolicy: SecurityPolicyProtocol.TLS_V1_1_2016,
            },
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: props.siteBucket
                    },
                    behaviors : [ {isDefaultBehavior: true}],
                }
            ]
        });
    }
}