#!/bin/bash

# Check if a stage is passed as an argument, otherwise default to 'dev'
STAGE=${1:-dev}

REGION=${2:-us-east-1}

echo "Listing all lambda functions in the serverless.yml file for stage: $STAGE in region: $REGION"

sls_info_output=$(npx sls info --verbose --stage $STAGE --region $REGION)
echo "$sls_info_output"

# Extract function names from the sls info output
function_names=$(echo "$sls_info_output" | awk '/functions:/{flag=1; next} /Stack Outputs:/{flag=0} flag' | grep -oP '(?<=: ).*')

# Save the function names to a file
echo "$function_names" > ./lambda-names