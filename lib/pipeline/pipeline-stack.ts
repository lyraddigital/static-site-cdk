import { PolicyStatement } from '@aws-cdk/aws-iam';
import { Construct, SecretValue, Stack, StackProps } from '@aws-cdk/core';

import { BuildSpec, BuildEnvironmentVariableType, LinuxBuildImage, PipelineProject } from '@aws-cdk/aws-codebuild';
import { Artifact, Pipeline } from '@aws-cdk/aws-codepipeline';
import { GitHubSourceAction, CodeBuildAction } from '@aws-cdk/aws-codepipeline-actions';

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    const buildProject = new PipelineProject(this, 'CodeBuildCompileProject', {
      buildSpec: BuildSpec.fromSourceFilename('build/buildAppSpec.yml'),
      environment: {
        buildImage: LinuxBuildImage.UBUNTU_14_04_NODEJS_10_14_1
      }
    });

    const deployCodePolicyStatementOne = new PolicyStatement();
    deployCodePolicyStatementOne.addAllResources();
    deployCodePolicyStatementOne.addActions('s3:ListBucket');

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
              project: buildProject, 
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
