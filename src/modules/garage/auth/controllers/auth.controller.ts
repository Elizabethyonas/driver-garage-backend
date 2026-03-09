import { Request, Response } from 'express';
import { GarageAuthService } from '../services/auth.service';
import type { GarageSignupDTO, GarageLocationDTO } from '../dtos/signup.dto';
import { parseLocation, parseServices } from '../validators/signup.validator';

const service = new GarageAuthService();

function normalizeGarageLocation(value: unknown): GarageLocationDTO {
  const loc = parseLocation(value);
  if (typeof loc.address !== 'string' || typeof loc.latitude !== 'number' || typeof loc.longitude !== 'number') {
    throw new Error('garage_location must include address, latitude, and longitude');
  }
  return {
    address: loc.address,
    latitude: loc.latitude,
    longitude: loc.longitude,
    place_id: loc.place_id,
  };
}

export const signup = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Business license document is required (PDF, JPG or PNG, max 10MB).' });
    }

    const body = req.body as Record<string, unknown>;
    const garage_location = normalizeGarageLocation(body.garage_location);
    const services_offered = parseServices(body.services_offered);
    if (services_offered.length === 0) {
      return res.status(400).json({ error: 'At least one service is required.' });
    }

    const dto: GarageSignupDTO = {
      garage_name: String(body.garage_name ?? '').trim(),
      phone_number: String(body.phone_number ?? '').trim(),
      email: String(body.email ?? '').trim(),
      password: String(body.password ?? ''),
      garage_location,
      services_offered,
      other_services: body.other_services != null ? String(body.other_services).trim() : undefined,
      business_license_url: `/uploads/garage-licenses/${req.file.filename}`,
    };

    const garage = await service.signup(dto);
    res.status(201).json({
      id: garage.id,
      garage_name: garage.name,
      email: garage.email,
      phone: garage.phone,
      status: garage.status,
      garage_location: {
        address: garage.address,
        latitude: garage.latitude,
        longitude: garage.longitude,
        place_id: garage.placeId,
      },
      services_offered: garage.servicesOffered,
      other_services: garage.otherServices,
      message: 'Application submitted. Your application will be reviewed within 24-48 hours. You will receive an email once approved.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Signup failed';
    res.status(400).json({ error: message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await service.login(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};