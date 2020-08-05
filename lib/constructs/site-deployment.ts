import { Construct } from '@aws-cdk/core';
import { IBucket } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import { CloudFrontWebDistribution } from '@aws-cdk/aws-cloudfront';

export interface SiteDeploymentProps {
    bucket: IBucket;
    sourceCodeFolder: string;
    distribution: CloudFrontWebDistribution;
}

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