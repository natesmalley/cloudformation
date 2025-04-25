#!/usr/bin/env bash
set -euo pipefail

: "${ARTIFACT_BUCKET:?export ARTIFACT_BUCKET=s3://my-bucket}"
STACK=purple-all
REGION=${AWS_DEFAULT_REGION:-us-east-1}

PKG_NAME=$(basename "$(ls /tmp/purple-*.tgz)")

aws cloudformation deploy \
  --template-file cloudformation/00-purple-infra.yml \
  --stack-name  "$STACK" \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
  --parameter-overrides \
      HelmChartS3Url="${ARTIFACT_BUCKET}/charts/${PKG_NAME}" \
      BucketName=purple-vulnerable-demo \
      EnableSSH=true \
      SshKeyPairName=my-key

echo "✅  Stack ${STACK} deployed (or updated)."
