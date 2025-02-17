import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { S3Resource } from "../resources/s3.resource";
import { ENV } from "../../config/env";

export class EMRResource {
  vpcId: pulumi.Output<string>;
  emrAppId: pulumi.Output<string>;

  constructor(provider: aws.Provider, bucket: S3Resource) {
    // Get default VPC ID as a Pulumi Output
    this.vpcId = pulumi.output(
      aws.ec2.getVpc({ default: true }, { provider }).then((vpc) => vpc.id)
    );

    // IAM Role for EMR Studio
    const emrRolePolicy = new aws.iam.Role(
      "emr-studio-role",
      {
        assumeRolePolicy: JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Principal: { Service: "elasticmapreduce.amazonaws.com" },
              Action: "sts:AssumeRole",
            },
          ],
        }),
      },
      { provider }
    );

    // IAM Role for EMR Serverless
    const emrServerlessRole = new aws.iam.Role(
      "emr-serverless-role",
      {
        assumeRolePolicy: JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Principal: { Service: "emr-serverless.amazonaws.com" },
              Action: "sts:AssumeRole",
            },
          ],
        }),
      },
      { provider }
    );

    // Attach EMR Studio policy
    new aws.iam.RolePolicyAttachment(
      "emr-studio-policy",
      {
        role: emrRolePolicy.name,
        policyArn: "arn:aws:iam::aws:policy/AmazonS3FullAccess",
      },
      { provider }
    );

    // Attach Amazon EMR Full Access
    new aws.iam.RolePolicyAttachment(
      "emr-full-access",
      {
        role: emrRolePolicy.name,
        policyArn:
          "arn:aws:iam::aws:policy/service-role/AmazonEMRServicePolicy_v2",
      },
      { provider }
    );

    // Attach necessary policies to the EMR role
    new aws.iam.RolePolicyAttachment(
      "emrServerlessPolicyAttachment",
      {
        role: emrServerlessRole.name,
        policyArn:
          "arn:aws:iam::aws:policy/service-role/AmazonEMRServicePolicy_v2", // Adjust policy as needed
      },
      { provider }
    );

    // ✅ Create an EMR Serverless Application
    const emrServerlessApp = new aws.emrserverless.Application(
      "emr-serverless-app",
      {
        name: "MyServerlessEMRApp",
        releaseLabel: "emr-6.10.0", // Adjust based on the required EMR version
        type: "SPARK", // Options: SPARK, HIVE
        networkConfiguration: {
          subnetIds: [ENV.SUBNET_ID], // Replace with valid subnet
          securityGroupIds: [ENV.SECURITY_GROUP_ID],
        },
      },
      { provider }
    );

    this.emrAppId = emrServerlessApp.id;

    // Create EMR Studio
    new aws.emr.Studio(
      "emr-studio",
      {
        authMode: "IAM",
        defaultS3Location: pulumi.interpolate`s3://${bucket.bucket.id}/`, // ✅ Corrected reference
        serviceRole: emrRolePolicy.arn,
        subnetIds: [ENV.SUBNET_ID], // Replace with your subnet ID(s)
        vpcId: this.vpcId, // ✅ Fixed to be a Pulumi Output
        workspaceSecurityGroupId: ENV.SECURITY_GROUP_ID,
        engineSecurityGroupId: ENV.SECURITY_GROUP_ID,
      },
      { provider }
    );
  }
}
