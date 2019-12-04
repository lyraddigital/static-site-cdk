import cdk = require('@aws-cdk/core');

import { WebsiteStack } from '../lib/website-stack';

const app = new cdk.App();
new WebsiteStack(app, 'WebsiteStack');