import { prisma } from '../../../../infrastructure/prisma/prisma.client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { GarageSignupDTO } from '../dtos/signup.dto';

export class GarageAuthService {
  async signup(dto: GarageSignupDTO) {
    const existingEmail = await prisma.garage.findUnique({ where: { email: dto.email } });
    if (existingEmail) throw new Error('Email already registered');

    const existingPhone = await prisma.garage.findFirst({ where: { phone: dto.phone_number } });
    if (existingPhone) throw new Error('Phone number already registered');

    const hashed = await bcrypt.hash(dto.password, 10);
    const { garage_location, services_offered, other_services, business_license_url } = dto;

    return prisma.garage.create({
      data: {
        name: dto.garage_name,
        email: dto.email,
        phone: dto.phone_number,
        password: hashed,
        address: garage_location.address,
        latitude: garage_location.latitude,
        longitude: garage_location.longitude,
        placeId: garage_location.place_id,
        servicesOffered: services_offered,
        otherServices: other_services ?? null,
        businessLicenseUrl: business_license_url,
        status: 'PENDING',
      },
    });
  }

  async login(email: string, password: string) {
    const garage = await prisma.garage.findUnique({ where: { email } });
    if (!garage) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(password, garage.password);
    if (!valid) throw new Error('Invalid credentials');

    const token = jwt.sign(
      { id: garage.id, role: 'GARAGE' },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    return { token, garage };
  }
}