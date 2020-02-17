import { Construct } from '@aws-cdk/core';
import { AddressRecordTarget, ARecord, HostedZone } from '@aws-cdk/aws-route53';
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets'

import { DomainSettingsService } from '../common/domain-settings.service';
import { DNSRecordProps } from './dns-record-props';

export class DNSRecord extends Construct {
    constructor(parent: Construct, id: string, props: DNSRecordProps) {
        super(parent, id);

        const domainSettings = DomainSettingsService.getSettingsFromContext(this);
        const zone = HostedZone.fromLookup(this, 'Zone', { domainName: domainSettings.rootDomain });
        
        new ARecord(this, 'WebiteAliasRecord', {
            recordName: domainSettings.rootDomain,
            target: AddressRecordTarget.fromAlias(new CloudFrontTarget(props.distribution)),
            zone
        });
    }
}