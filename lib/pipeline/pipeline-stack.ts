import { PolicyStatement } from '@aws-cdk/aws-iam';
import { Construct, SecretValue, Stack, StackProps } from '@aws-cdk/core';
import { BuildSpec, BuildEnvironmentVariableType, LinuxBuildImage, PipelineProject } from '@aws-cdk/aws-codebuild';
import { Artifact, Pipeline } from '@aws-cdk/aws-codepipeline';
import { GitHubSourceAction, CodeBuildAction } from '@aws-cdk/aws-codepipeline-actions';
import { Bucket } from '@aws-cdk/aws-s3';

import { BuildProject } from './actions/build/build-project';

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    const buildProject = new BuildProject(this, 'BuildProject');

    const deployCodePolicyStatementOne = new PolicyStatement();
    deployCodePolicyStatementOne.addAllResources();
    deployCodePolicyStatementOne.addActions('s3:ListBucket');

    const bucketName = 'test.lyraddigital.com'; // Import later
    const bucket = Bucket.fromBucketAttributes(this, 'WebsiteBucket', {
      bucketArn: `arn:aws:s3:::${bucketName}`
    });

    const deployCodePolicyStatementTwo = new PolicyStatement();
    deployCodePolicyStatementTwo.addResources('arn:aws:s3:::test.lyraddigital.com/*');
    deployCodePolicyStatementTwo.addActions('s3:PutObject', 's3:PutObjectAcl', 's3:DeleteObject');

    const sourceOutput = new Artifact();
    const buildOutput = new Artifact();

    const deploymentProject = new PipelineProject(this, 'CodeBuildDeploymentProject', {
      buildSpec: BuildSpec.fromSourceFilename('build/deployAppSpec.yml'),
      environment: {
        buildImage: LinuxBuildImage.UBUNTU_14_04_NODEJS_10_14_1
      },
      environmentVariables: {
        WEBSITE_BUCKET: {
          type: BuildEnvironmentVariableType.PLAINTEXT,
          value: 's3://test.lyraddigital.com' // Import this value later
        }
      }
    });

    
    bucket.grantPut(deploymentProject);
    bucket.grantDelete(deploymentProject);

    deploymentProject.addToRolePolicy(deployCodePolicyStatementOne);
    deploymentProject.addToRolePolicy(deployCodePolicyStatementTwo);

    new Pipeline(this, 'Pipeline', {
      stages: [
        {
          stageName: 'Source',
          actions: [
            new GitHubSourceAction({
              actionName: 'Source',
              repo: 'lyraddigitalwebsite',
              branch: 'testbranch', // Import this value.
              output: sourceOutput,
              owner: 'lyraddigital',
              oauthToken: SecretValue.plainText('b2155537bd39d7fb4769aa184547b13c624a0132') // Import this value.
            })
          ]
        },
        {
          stageName: 'Build',
          actions: [
            new CodeBuildAction({
              input: sourceOutput,
              outputs: [
                buildOutput
              ],
              actionName: 'Build',
              project: buildProject.project, 
            })
          ]
        },
        {
          stageName: 'Deploy',
          actions: [
            new CodeBuildAction({
              input: buildOutput,
              actionName: 'Deploy',
              project: deploymentProject
            })
          ]
        }
      ]
    });
  }
}
