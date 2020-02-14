import { Construct, RemovalPolicy } from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';

import { SiteDomainProps } from '../props/site-domain-props';

export class SiteBucket extends Construct {
    public instance: Bucket;

    constructor(parent: Construct, id: string, props: SiteDomainProps) {
        super(parent, id);

        this.instance = new Bucket(this, 'WebsiteBucket', {
            bucketName: `${props.rootDomain}.${props.subDomain}`,
            websiteIndexDocument: 'index.html',
            publicReadAccess: true,
      
            // Keep for all environments except production
            removalPolicy: RemovalPolicy.DESTROY
        });
    }
}