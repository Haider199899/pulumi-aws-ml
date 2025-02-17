import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
export class AWSConfig {
  awsConfig: pulumi.Config;
  constructor() {
    this.awsConfig = new pulumi.Config("aws");
  }
  get region(): aws.Region {
    return this.awsConfig.require("region");
  }
}
export const AWS_CONFIG = new AWSConfig();
