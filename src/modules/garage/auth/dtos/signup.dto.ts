export interface GarageLocationDTO {
  address: string;
  latitude: number;
  longitude: number;
  place_id?: string;
}

export interface GarageSignupDTO {
  garage_name: string;
  phone_number: string;
  email: string;
  password: string;
  garage_location: GarageLocationDTO;
  services_offered: string[];
  other_services?: string;
  business_license_url: string;
}
