import { SynthUtils } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';

import { SiteBucket } from '../../lib/website/s3/site-bucket';

test('bucket is created', () => {
  const stack = new Stack();
  new SiteBucket(stack, 'SiteBucket');
  
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});