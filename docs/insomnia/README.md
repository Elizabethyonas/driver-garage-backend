# Insomnia – Driver Vehicles API

## Import collection

1. Open **Insomnia**.
2. **Application** → **Preferences** → **Data** → **Import Data** (or drag the JSON file).
3. Select `Driver-Vehicles-API.json` from this folder.

## Environment

- **base_url**: `http://localhost:4000` (or your server URL).
- **driver_token**: Set this after running **Driver Login** (copy `token` from the response).
- **vehicle_id**: Set this after **POST Create Vehicle** (copy `id` from the created vehicle) for GET/PUT/DELETE by ID.

## Test order

1. **Driver Login** – sign in with a driver account; copy `token` into `driver_token` in the environment.
2. **POST Create Vehicle** – create a vehicle; copy `id` into `vehicle_id` if you want to use GET/PUT/DELETE by ID.
3. **GET List Vehicles** – list all vehicles for the driver.
4. **GET Vehicle by ID** – get one vehicle (requires `vehicle_id`).
5. **PUT Update Vehicle** – update that vehicle (requires `vehicle_id`).
6. **DELETE Vehicle** – delete that vehicle (requires `vehicle_id`).

All vehicle requests (except Login) need **Authorization**: `Bearer <driver_token>`.
