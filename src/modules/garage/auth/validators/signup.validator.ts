import { body } from 'express-validator';

export const GARAGE_SERVICE_SLUGS = [
  'oil_change',
  'tire_service',
  'brake_repair',
  'engine_diagnostics',
  'battery_service',
  'ac_repair',
  'other',
] as const;

export function parseLocation(value: unknown): { address?: string; latitude?: number; longitude?: number; place_id?: string } {
  if (value == null) return {};
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as { address?: string; latitude?: number; longitude?: number; place_id?: string };
    } catch {
      return {};
    }
  }
  if (typeof value === 'object' && value !== null) {
    const o = value as Record<string, unknown>;
    const lat = o.latitude;
    const lng = o.longitude;
    return {
      address: typeof o.address === 'string' ? o.address : undefined,
      latitude: typeof lat === 'number' ? lat : (typeof lat === 'string' ? Number(lat) : undefined),
      longitude: typeof lng === 'number' ? lng : (typeof lng === 'string' ? Number(lng) : undefined),
      place_id: typeof o.place_id === 'string' ? o.place_id : undefined,
    };
  }
  return {};
}

export function parseServices(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((s): s is string => typeof s === 'string');
  if (typeof value === 'string') {
    try {
      const arr = JSON.parse(value);
      return Array.isArray(arr) ? arr.filter((s: unknown): s is string => typeof s === 'string') : [];
    } catch {
      return [];
    }
  }
  return [];
}

export const garageSignupValidator = [
  body('garage_name')
    .trim()
    .notEmpty()
    .withMessage('Garage name is required'),
  body('phone_number')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('confirm_password')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => value === req.body?.password)
    .withMessage('Passwords do not match'),
  body('garage_location')
    .custom((value) => {
      const loc = parseLocation(value);
      if (typeof loc.address !== 'string' || loc.address.trim() === '') return false;
      if (typeof loc.latitude !== 'number' || typeof loc.longitude !== 'number') return false;
      return true;
    })
    .withMessage('garage_location must include address, latitude, and longitude'),
  body('services_offered')
    .custom((value) => {
      const arr = parseServices(value);
      if (arr.length === 0) return false;
      const invalid = arr.some((s) => !GARAGE_SERVICE_SLUGS.includes(s as typeof GARAGE_SERVICE_SLUGS[number]));
      return !invalid;
    })
    .withMessage('At least one service is required; use slug format (e.g. oil_change, tire_service)'),
  body('other_services').custom((value, { req }) => {
    const services = parseServices(req.body?.services_offered);
    if (!services.includes('other')) return true;
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error('other_services is required when "other" is selected in services_offered');
    }
    return true;
  }),
];
