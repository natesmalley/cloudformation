#!/usr/bin/env bash
set -e
LAMBDA_DIR=lambdas/ack-helm-handler
ZIP=ack-helm-handler.zip
BUCKET=my-cf-assets-307946665489-us-east-2
cd "$LAMBDA_DIR"
zip -r ../../$ZIP .
aws s3 cp ../../$ZIP s3://$BUCKET/