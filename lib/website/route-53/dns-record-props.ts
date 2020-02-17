import { CloudFrontWebDistribution } from "@aws-cdk/aws-cloudfront";

export interface DNSRecordProps {
    distribution: CloudFrontWebDistribution
}