import * as pulumi from "@pulumi/pulumi";

class Env {
  awsConfig : pulumi.Config
  constructor() {
    this.awsConfig = new pulumi.Config("ENV")
  }

  get ACCESS_KEY_ID(): pulumi.Output<string> {
    return this.awsConfig.requireSecret("AWS_ACCESS_KEY_ID")
  }

  get SECRET_ACCESS_KEY(): pulumi.Output<string> {
    return this.awsConfig.requireSecret("AWS_SECRET_ACCESS_KEY");
  }

  get SUBNET_ID(): pulumi.Output<string> {
    return this.awsConfig.requireSecret("SUBNET_ID");
  }

  get SECURITY_GROUP_ID(): pulumi.Output<string> {
    return this.awsConfig.requireSecret("SECURITY_GROUP_ID");
  }

  get AWS_ACCOUNT_ID(): pulumi.Output<string> {
    return this.awsConfig.requireSecret("AWS_ACCOUNT_ID");
  }

  get IAM_USERNAME(): pulumi.Output<string> {
    return this.awsConfig.requireSecret("IAM_USERNAME");
  }
}
export const ENV = new Env();
