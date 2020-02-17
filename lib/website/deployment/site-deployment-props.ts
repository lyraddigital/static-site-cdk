import { Bucket } from '@aws-cdk/aws-s3';
import { CloudFrontWebDistribution } from '@aws-cdk/aws-cloudfront';

export interface SiteDeploymentProps {
    bucket: Bucket;
    sourceCodeFolder: string;
    distribution: CloudFrontWebDistribution;
}