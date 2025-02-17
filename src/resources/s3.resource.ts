import * as aws from "@pulumi/aws";
import { Bucket } from "@pulumi/aws/s3";

export class S3Resource {
  public readonly bucket: Bucket;
  constructor(provider: aws.Provider) {
    this.bucket = new Bucket("test-bucket-v1", {}, { provider });
  }
}
