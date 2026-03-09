/**
 * Test garage signup. Uses Node 18+ fetch + FormData.
 *
 * Prerequisites:
 *   1. npm run dev (server running)
 *   2. A PDF or image file for the license
 *
 * Run:
 *   node scripts/test-garage-signup.mjs path/to/license.pdf
 *   node scripts/test-garage-signup.mjs path/to/license.jpg
 */

import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4000';
const licensePath = process.argv[2];

if (!licensePath || !fs.existsSync(licensePath)) {
  console.error('Usage: node scripts/test-garage-signup.mjs <path-to-pdf-or-image>');
  process.exit(1);
}

const email = `garage-test-${Date.now()}@example.com`;
const form = new FormData();
form.append('garage_name', 'Test Garage');
form.append('phone_number', '0911223344');
form.append('email', email);
form.append('password', 'password123');
form.append('confirm_password', 'password123');
form.append('garage_location', JSON.stringify({
  address: 'Bole Road, Addis Ababa',
  latitude: 8.9806,
  longitude: 38.7578,
}));
form.append('services_offered', JSON.stringify(['oil_change', 'tire_service']));
form.append('business_license_document', new Blob([fs.readFileSync(licensePath)]), path.basename(licensePath));

const res = await fetch(`${BASE_URL}/garages/auth/signup`, {
  method: 'POST',
  body: form,
});

const text = await res.text();
let json;
try {
  json = JSON.parse(text);
} catch {
  json = { raw: text };
}

console.log('Status:', res.status);
console.log('Response:', JSON.stringify(json, null, 2));
process.exit(res.ok ? 0 : 1);
