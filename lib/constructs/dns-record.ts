import { Construct } from '@aws-cdk/core';
import { AddressRecordTarget, ARecord, HostedZone } from '@aws-cdk/aws-route53';
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets'
import { CloudFrontWebDistribution } from "@aws-cdk/aws-cloudfront";

import { DomainProps } from '../props/domain-props';

export interface DNSRecordProps extends DomainProps {
    distribution: CloudFrontWebDistribution
}

export class DNSRecord extends Construct {
    constructor(parent: Construct, id: string, props: DNSRecordProps) {
        super(parent, id);

        const zone = HostedZone.fromLookup(this, 'Zone', { domainName: props.rootDomain });
        
        new ARecord(this, 'WebiteAliasRecord', {
            recordName: props.rootDomain,
            target: AddressRecordTarget.fromAlias(new CloudFrontTarget(props.distribution)),
            zone
        });
    }
}