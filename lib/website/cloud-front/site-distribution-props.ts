import { Bucket } from "@aws-cdk/aws-s3";

export interface SiteDistributionProps {
    siteBucket: Bucket;
}