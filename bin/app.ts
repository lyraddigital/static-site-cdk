import cdk = require('@aws-cdk/core');

import { WebsiteStack } from '../lib/website/website-stack';
import { PipelineStack } from '../lib/pipeline/pipeline-stack';

const app = new cdk.App();
new WebsiteStack(app, 'WebsiteStack', { 
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});

//new PipelineStack(app, 'PipelineStack');