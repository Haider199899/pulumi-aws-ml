import * as pulumi from "@pulumi/pulumi";
import { Provider } from "@pulumi/aws";
import { ENV } from "./config/env";
import { AWS_CONFIG } from "./config/aws.config";
import { S3Resource } from "./src/resources/s3.resource";
import {EMRResource} from "./src/resources/emr.resource"
const provider = new Provider("aws", {
  secretKey: ENV.SECRET_ACCESS_KEY,
  accessKey: ENV.ACCESS_KEY_ID,
  region: AWS_CONFIG.region,
});

const infrastructure = () => {
  const bucket = new S3Resource(provider);
  const emrStudio = new EMRResource(provider, bucket)

};
infrastructure()