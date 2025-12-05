#!/bin/bash
# Retrieve the secret name from the command line argument
secret_name=$1

# Get the secret value and store it in a variable
secrets=$(aws secretsmanager get-secret-value --secret-id $secret_name --query SecretString --output text)

# Convert all values to strings using jq
modified_secrets=$(echo $secrets | jq -r 'to_entries | map("\(.key)=\(.value|tostring | gsub("\\n"; "\\\\n"))") | .[]')

# Export the secrets as environment variables
export $modified_secrets

# Optionally, you can write the secrets to a .env file
echo "$modified_secrets" > .env

