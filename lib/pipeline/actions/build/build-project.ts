import { Construct } from '@aws-cdk/core';
import { BuildSpec, LinuxBuildImage, PipelineProject } from '@aws-cdk/aws-codebuild';

export class BuildProject extends Construct {
  public project: PipelineProject;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    
    this.project = new PipelineProject(this, 'CodeBuildCompileProject', {
      buildSpec: BuildSpec.fromSourceFilename('build/buildAppSpec.yml'),
      environment: {
        buildImage: LinuxBuildImage.UBUNTU_14_04_NODEJS_10_14_1
      }
    });
  }
}
