-- AlterTable: add garage signup fields (location, services, business license)
ALTER TABLE "Garage" ADD COLUMN IF NOT EXISTS "address" TEXT;
ALTER TABLE "Garage" ADD COLUMN IF NOT EXISTS "latitude" DOUBLE PRECISION;
ALTER TABLE "Garage" ADD COLUMN IF NOT EXISTS "longitude" DOUBLE PRECISION;
ALTER TABLE "Garage" ADD COLUMN IF NOT EXISTS "place_id" TEXT;
ALTER TABLE "Garage" ADD COLUMN IF NOT EXISTS "services_offered" TEXT[] DEFAULT '{}';
ALTER TABLE "Garage" ADD COLUMN IF NOT EXISTS "other_services" TEXT;
ALTER TABLE "Garage" ADD COLUMN IF NOT EXISTS "business_license_url" TEXT;
