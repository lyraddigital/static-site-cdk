import { Construct, RemovalPolicy } from '@aws-cdk/core';
import { Bucket, IBucket } from '@aws-cdk/aws-s3';

import { DomainProps } from '../props/domain-props';

export class SiteBucket extends Construct {
    public readonly instance: IBucket;

    constructor(parent: Construct, id: string, domainProps: DomainProps) {
        super(parent, id);

        this.instance = new Bucket(this, 'WebsiteBucket', {
            bucketName: `${domainProps.subDomain}.${domainProps.rootDomain}`,
            websiteIndexDocument: 'index.html',
            publicReadAccess: true,
      
            // Keep for all environments except production
            removalPolicy: RemovalPolicy.DESTROY
        });
    }
}