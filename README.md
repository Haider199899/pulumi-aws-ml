# Pulumi Setup Guide

## Prerequisites
Before getting started, ensure you have the following installed:

- [Pulumi CLI](https://www.pulumi.com/docs/install/)
- [AWS CLI](https://aws.amazon.com/cli/) (configured with your AWS credentials)
- Node.js (if using Pulumi with JavaScript/TypeScript)

## 1. Set Up Pulumi Project
If you haven't already initialized a Pulumi project, create a new one:

```sh
pulumi new aws-typescript  # For TypeScript
```

## 2. Configure Environment Variables using `pulumi config set`
Run the following commands to securely set the required AWS credentials and environment variables:

```sh
pulumi config set --secret ENV:AWS_ACCESS_KEY_ID "xxxxxxxxxx"
pulumi config set --secret ENV:AWS_SECRET_ACCESS_KEY "xxxxxxxx"
pulumi config set aws:region "xxxxx"
pulumi config set ENV:SUBNET_ID "xxxxxxxxxxx"
pulumi config set ENV:SECURITY_GROUP_ID "xxxxxxxxxxxxx"
pulumi config set ENV:AWS_ACCOUNT_ID "xxxxxxx"
pulumi config set ENV:IAM_USERNAME "xxxxxxxxxxxxx"
```

### Explanation:
- `--secret` ensures sensitive data (like AWS credentials) is encrypted.
- `aws:region` sets the AWS region for Pulumi resources.
- Other `ENV` variables are used for networking and IAM configurations.

## 3. Deploy Infrastructure with Pulumi
Once the configuration is set, deploy the stack using:

```sh
pulumi up
```

This will:
1. Preview the changes.
2. Prompt for confirmation.
3. Deploy the resources to AWS.

## 4. Verify Deployment
After deployment, check your AWS Console or use Pulumi commands:

```sh
pulumi stack output  # View stack outputs
pulumi stack ls      # List all stacks
pulumi logs          # View logs (if applicable)
```

## 5. Cleanup (If Needed)
To destroy all deployed resources:

```sh
pulumi destroy
```

This will remove all infrastructure created by Pulumi.

---

You're all set! 🎉 Pulumi is now configured and ready to manage your AWS infrastructure.

