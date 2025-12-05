#!/bin/bash

# Retrieve the secret name from the command line argument
secret_name=$1

# Get the secret value and store it in a variable
secrets=$(aws secretsmanager get-secret-value --secret-id $secret_name --query SecretString --output text )

# Create a temporary file to store the environment variables
tmp_file=$(mktemp)

# Convert all values to strings using jq
modified_secrets=$(echo "$secrets" | jq -c 'to_entries | map(.value |= gsub("\\n"; "\\\\n")) | from_entries')

# Write the modified secrets to the temporary file
echo "{\"Variables\": $modified_secrets}" > $tmp_file
# Generate a file in the current folder
cp $tmp_file ./secrets.json
