import { prisma } from '../../../../infrastructure/prisma/prisma.client';

export interface CreateVehicleInput {
  plateNumber: string;
  make: string;
  model: string;
  type?: string;
  year: number;
  color?: string;
}

export interface UpdateVehicleInput {
  plateNumber?: string;
  make?: string;
  model?: string;
  type?: string;
  year?: number;
  color?: string;
}

export class DriverVehiclesService {
  async create(driverId: string, data: CreateVehicleInput) {
    if (!data.plateNumber?.trim()) throw new Error('Plate number is required');
    if (!data.make?.trim()) throw new Error('Make is required');
    if (!data.model?.trim()) throw new Error('Model is required');
    if (data.year == null || typeof data.year !== 'number' || data.year < 1900 || data.year > new Date().getFullYear() + 1) {
      throw new Error('Valid year is required');
    }
    const existing = await prisma.vehicle.findFirst({
      where: { driverId, plateNumber: data.plateNumber.trim() },
    });
    if (existing) throw new Error('A vehicle with this plate number is already registered');

    return prisma.vehicle.create({
      data: {
        driverId,
        plateNumber: data.plateNumber.trim(),
        make: data.make.trim(),
        model: data.model.trim(),
        type: data.type?.trim() || null,
        year: data.year,
        color: data.color?.trim() || null,
      },
    });
  }

  async findAll(driverId: string) {
    return prisma.vehicle.findMany({
      where: { driverId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(driverId: string, vehicleId: string) {
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: vehicleId, driverId },
    });
    if (!vehicle) throw new Error('Vehicle not found');
    return vehicle;
  }

  async update(driverId: string, vehicleId: string, data: UpdateVehicleInput) {
    const vehicle = await this.findOne(driverId, vehicleId);

    if (data.year !== undefined && (typeof data.year !== 'number' || data.year < 1900 || data.year > new Date().getFullYear() + 1)) {
      throw new Error('Valid year is required');
    }
    if (data.plateNumber !== undefined) {
      const duplicate = await prisma.vehicle.findFirst({
        where: {
          driverId,
          plateNumber: data.plateNumber.trim(),
          id: { not: vehicleId },
        },
      });
      if (duplicate) throw new Error('Another vehicle with this plate number already exists');
    }

    return prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        ...(data.plateNumber !== undefined && { plateNumber: data.plateNumber.trim() }),
        ...(data.make !== undefined && { make: data.make.trim() }),
        ...(data.model !== undefined && { model: data.model.trim() }),
        ...(data.type !== undefined && { type: data.type?.trim() || null }),
        ...(data.year !== undefined && { year: data.year }),
        ...(data.color !== undefined && { color: data.color?.trim() || null }),
      },
    });
  }

  async delete(driverId: string, vehicleId: string) {
    await this.findOne(driverId, vehicleId);
    await prisma.vehicle.delete({ where: { id: vehicleId } });
    return { message: 'Vehicle deleted successfully' };
  }
}
