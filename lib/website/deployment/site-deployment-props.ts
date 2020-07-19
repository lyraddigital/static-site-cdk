import { IBucket } from '@aws-cdk/aws-s3';
import { CloudFrontWebDistribution } from '@aws-cdk/aws-cloudfront';

export interface SiteDeploymentProps {
    bucket: IBucket;
    sourceCodeFolder: string;
    distribution: CloudFrontWebDistribution;
}