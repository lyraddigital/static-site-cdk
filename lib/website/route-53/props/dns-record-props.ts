import { CloudFrontWebDistribution } from "@aws-cdk/aws-cloudfront";

export interface DNSRecordProps {
    domainName: string;
    distribution: CloudFrontWebDistribution
}