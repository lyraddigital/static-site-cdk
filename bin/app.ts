import cdk = require('@aws-cdk/core');

import { WebsiteStack } from '../lib/website/website-stack';
import { PipelineStack } from '../lib/pipeline/pipeline-stack';

const app = new cdk.App();
new WebsiteStack(app, 'WebsiteStack');

//new PipelineStack(app, 'PipelineStack');