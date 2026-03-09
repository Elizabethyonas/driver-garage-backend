#!/usr/bin/env bash
# Test garage signup (multipart/form-data).
# Usage:
#   1. Start server: npm run dev
#   2. Set LICENSE_FILE to a PDF or image path (e.g. ./test-license.pdf)
#   3. Run: bash scripts/test-garage-signup.sh

set -e
BASE_URL="${BASE_URL:-http://localhost:4000}"
LICENSE_FILE="${LICENSE_FILE:-}"

if [ -z "$LICENSE_FILE" ] || [ ! -f "$LICENSE_FILE" ]; then
  echo "Set LICENSE_FILE to a PDF or image file. Example:"
  echo "  LICENSE_FILE=./test.pdf bash scripts/test-garage-signup.sh"
  exit 1
fi

# Unique email to avoid duplicate key errors
EMAIL="garage-test-$(date +%s)@example.com"

curl -s -X POST "$BASE_URL/garages/auth/signup" \
  -F "garage_name=Test Garage" \
  -F "phone_number=0911223344" \
  -F "email=$EMAIL" \
  -F "password=password123" \
  -F "confirm_password=password123" \
  -F 'garage_location={"address":"Bole Road, Addis Ababa","latitude":8.9806,"longitude":38.7578}' \
  -F 'services_offered=["oil_change","tire_service"]' \
  -F "business_license_document=@$LICENSE_FILE" \
  -w "\nHTTP Status: %{http_code}\n"
