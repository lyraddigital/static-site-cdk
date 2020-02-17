import { Construct } from '@aws-cdk/core';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';

import { SiteDeploymentProps } from './site-deployment-props';

export class SiteDeployment extends Construct {
    constructor(parent: Construct, id: string, props: SiteDeploymentProps) {
        super(parent, id);

        new BucketDeployment(this, 'DeployWebsite', {
            sources: [Source.asset(props.sourceCodeFolder)],
            destinationBucket: props.bucket,
            distribution: props.distribution,
            distributionPaths: ['/index.html', '/assets/**']
        });
    }
}