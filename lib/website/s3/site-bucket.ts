import { Construct, RemovalPolicy } from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';

import { DomainSettingsService } from '../common/domain-settings.service';

export class SiteBucket extends Construct {
    public instance: Bucket;

    constructor(parent: Construct, id: string) {
        super(parent, id);

        const domainSettings = DomainSettingsService.getSettingsFromContext(this);

        this.instance = new Bucket(this, 'WebsiteBucket', {
            bucketName: `${domainSettings.rootDomain}.${domainSettings.subDomain}`,
            websiteIndexDocument: 'index.html',
            publicReadAccess: true,
      
            // Keep for all environments except production
            removalPolicy: RemovalPolicy.DESTROY
        });
    }
}