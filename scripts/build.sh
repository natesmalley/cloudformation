#!/usr/bin/env bash
set -euo pipefail

: "${ARTIFACT_BUCKET:?export ARTIFACT_BUCKET=s3://my-bucket}"

CHART_DIR="helm/purple"

echo "📦  Packaging Helm chart ..."
helm lint "${CHART_DIR}"
PKG=$(helm package "${CHART_DIR}" --destination /tmp | awk '{print $NF}')

echo "⬆️  Uploading $(basename "$PKG") to ${ARTIFACT_BUCKET}/charts/..."
aws s3 cp "$PKG" "${ARTIFACT_BUCKET}/charts/"

echo "✅  Chart uploaded."
