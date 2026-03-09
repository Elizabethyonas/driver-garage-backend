# Insomnia collections

## Import a collection

1. Open **Insomnia**.
2. **Application** → **Preferences** → **Data** → **Import Data** (or drag the JSON file).
3. Select the JSON file from this folder (`Driver-Vehicles-API.json` or `Garage-Signup-API.json`).

---

## Garage Signup API (`Garage-Signup-API.json`)

### Environment

- **base_url**: `http://localhost:4000` (or your server URL).

### Requests

1. **Garage Signup (multipart)** – Create a garage account.
   - **Body**: multipart/form-data. All fields are pre-filled; change `email` to a unique value for each run.
   - **business_license_document**: In the request body, click the file row and **Select File** to attach a PDF, JPG, or PNG (max 10MB).
   - **services_offered**: JSON array of slugs, e.g. `["oil_change","tire_service"]`. If you include `"other"`, fill **other_services**.
   - Expect **201** and a garage object + “Application submitted…” message.

2. **Garage Login** – Login with email and password (JSON body). Returns `token` and garage.

### Test order

1. Run **Garage Signup (multipart)** (attach a license file; use a unique email).
2. Run **Garage Login** with the same email and password.

---

## Driver Vehicles API (`Driver-Vehicles-API.json`)

### Environment

- **base_url**: `http://localhost:4000` (or your server URL).
- **driver_token**: Set after **Driver Login** (copy `token` from the response).
- **vehicle_id**: Set after **POST Create Vehicle** (copy `id`) for GET/PUT/DELETE by ID.

### Test order

1. **1. Driver Signup** – create a driver account (first time only). Use a unique email and phone.
2. **2. Driver Login** – sign in with the same phone and password; copy `token` into `driver_token` in the environment.
3. **POST Create Vehicle** – create a vehicle; copy `id` into `vehicle_id` if you want to use GET/PUT/DELETE by ID.
4. **GET List Vehicles** – list all vehicles for the driver.
5. **GET Vehicle by ID** – get one vehicle (requires `vehicle_id`).
6. **PUT Update Vehicle** – update that vehicle (requires `vehicle_id`).
7. **DELETE Vehicle** – delete that vehicle (requires `vehicle_id`).

All vehicle requests (except Login) need **Authorization**: `Bearer <driver_token>`.
