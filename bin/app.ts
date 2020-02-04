import cdk = require('@aws-cdk/core');

import { WebsiteStack } from '../lib/website-stack';
import { PipelineStack } from '../lib/pipeline-stack';

const app = new cdk.App();
// new WebsiteStack(app, 'WebsiteStack');
new PipelineStack(app, 'PipelineStack');