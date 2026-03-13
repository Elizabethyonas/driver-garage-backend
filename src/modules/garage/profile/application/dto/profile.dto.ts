/** Body for PUT /garage/profile (basic info only; services/slots managed via their own APIs) */
export interface GarageProfileDTO {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

/** Service linked by id (from GarageService table) */
export interface GarageProfileServiceItem {
  id: string;
  garageId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Availability slot linked by id (from GarageAvailabilitySlot table) */
export interface GarageProfileAvailabilitySlot {
  id: string;
  garageId: string;
  dayOfWeek: string;
  startMinute: number;
  endMinute: number;
  createdAt: Date;
  updatedAt: Date;
}

/** GET /garage/profile response: garage + services and availabilitySlots linked by id (no redundant data) */
export interface GarageProfileResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  services: GarageProfileServiceItem[];
  availabilitySlots: GarageProfileAvailabilitySlot[];
}
