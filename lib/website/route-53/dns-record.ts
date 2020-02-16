import { Construct } from '@aws-cdk/core';
import { AddressRecordTarget, ARecord, HostedZone } from '@aws-cdk/aws-route53';
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets'

import { DNSRecordProps } from './props/dns-record-props';

export class DNSRecord extends Construct {
    constructor(parent: Construct, id: string, props: DNSRecordProps) {
        super(parent, id);

        const zone = HostedZone.fromLookup(this, 'Zone', { domainName: props.domainName });
        new ARecord(this, 'WebiteAliasRecord', {
            recordName: props.domainName,
            target: AddressRecordTarget.fromAlias(new CloudFrontTarget(props.distribution)),
            zone
        });
    }
}