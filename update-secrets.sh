#!/bin/bash

sh .github/workflows/secrets.sh dev-env-file
#sh .github/workflows/list-lambda-functions.sh dev us-west-1
  echo "Updating environment for $lambda_name"
  aws lambda update-function-configuration --function-name "handshake-service-dev-create-deal" --environment file://secrets.json > /dev/null 2>&1
    aws lambda update-function-configuration --function-name "handshake-service-dev-handle-expired-handshakes" --environment file://secrets.json > /dev/null 2>&1

rm lambda-names
rm secrets.json