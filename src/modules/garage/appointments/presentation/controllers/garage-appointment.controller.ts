import { Request, Response } from 'express';
import { PrismaAppointmentRepository } from '../../infrastructure/repositories/prisma-appointment.repository';
import { ListGarageAppointmentsUseCase } from '../../application/usecases/list-garage-appointments.usecase';
import { GetGarageAppointmentUseCase } from '../../application/usecases/get-garage-appointment.usecase';
import { ApproveAppointmentUseCase } from '../../application/usecases/approve-appointment.usecase';
import { RejectAppointmentUseCase } from '../../application/usecases/reject-appointment.usecase';
import { UpdateServiceStatusUseCase } from '../../application/usecases/update-service-status.usecase';
import { ListAppointmentsQueryDto } from '../../application/dto/list-appointments-query.dto';
import { UpdateServiceStatusRequestDto } from '../../application/dto/update-service-status.dto';
import { AppointmentResponseDto } from '../../application/dto/appointment-response.dto';
import { AppointmentStatus } from '../../domain/entities/appointment.entity';
import { prisma } from '../../../../../infrastructure/prisma/prisma.client';

const repository = new PrismaAppointmentRepository();
const listUseCase = new ListGarageAppointmentsUseCase(repository);
const getUseCase = new GetGarageAppointmentUseCase(repository);
const approveUseCase = new ApproveAppointmentUseCase(repository);
const rejectUseCase = new RejectAppointmentUseCase(repository);
const updateStatusUseCase = new UpdateServiceStatusUseCase(repository);

export const listAppointments = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user.id as string;
    const queryDto = ListAppointmentsQueryDto.from(req.query);
    const search =
      (req.query.search as string | undefined) ?? (req.query.q as string | undefined) ?? undefined;

    const appointments = await listUseCase.execute({ garageId, status: queryDto.status });

    const driverIds = Array.from(new Set(appointments.map((a) => a.toJSON().driverId)));

    const [drivers, vehicles] = await Promise.all([
      prisma.driver.findMany({ where: { id: { in: driverIds } } }),
      prisma.vehicle.findMany({ where: { driverId: { in: driverIds } } }),
    ]);

    type DriverRow = (typeof drivers)[number];
    type VehicleRow = (typeof vehicles)[number];

    const driverMap = new Map<string, DriverRow>();
    drivers.forEach((d) => driverMap.set(d.id, d));

    const vehiclesByDriver = new Map<string, VehicleRow[]>();
    vehicles.forEach((v) => {
      const arr = vehiclesByDriver.get(v.driverId) ?? [];
      arr.push(v);
      vehiclesByDriver.set(v.driverId, arr);
    });

    const term = search?.trim().toLowerCase();

    const result = appointments
      .filter((appt) => {
        if (!term) return true;
        const json = appt.toJSON();
        const driver = driverMap.get(json.driverId);
        const vList = vehiclesByDriver.get(json.driverId) ?? [];

        const driverName =
          driver && typeof driver.firstName === 'string' && typeof driver.lastName === 'string'
            ? `${driver.firstName} ${driver.lastName}`.toLowerCase()
            : '';

        const matchesDriver = driverName.includes(term);

        const matchesVehicle = vList.some((v) => {
          const name = `${v.make ?? ''} ${v.model ?? ''}`.toLowerCase();
          const plate = (v.plateNumber ?? '').toLowerCase();
          return name.includes(term) || plate.includes(term);
        });

        return matchesDriver || matchesVehicle;
      })
      .map((appt) => {
        const base = AppointmentResponseDto.from(appt);
        const json = appt.toJSON();
        const driver = driverMap.get(json.driverId);
        const vList = vehiclesByDriver.get(json.driverId) ?? [];

        return {
          ...base,
          driver: driver
            ? {
              id: driver.id,
              firstName: driver.firstName,
              lastName: driver.lastName,
              email: driver.email,
              phone: driver.phone,
            }
            : null,
          vehicles: vList.map((v) => {
            const anyV = v as any;
            return {
              id: v.id,
              plateNumber: v.plateNumber,
              make: v.make,
              model: v.model,
              year: v.year,
              color: v.color,
              vin: anyV.vin ?? null,
              mileage: anyV.mileage ?? null,
              fuelType: anyV.fuelType ?? null,
            };
          }),
        };
      });

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const listAppointmentHistory = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user.id as string;
    const [completed, cancelled] = await Promise.all([
      listUseCase.execute({ garageId, status: AppointmentStatus.Completed }),
      listUseCase.execute({ garageId, status: AppointmentStatus.Cancelled }),
    ]);
    const combined = [...completed, ...cancelled].sort(
      (a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
    );
    res.json(combined.map((a) => AppointmentResponseDto.from(a)));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};

export const getAppointment = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user.id as string;
    const id = String((req.params as any).id);
    const appointment = await getUseCase.execute({ garageId, id });
    const json = appointment.toJSON();

    const [driver, vehicles] = await Promise.all([
      prisma.driver.findUnique({ where: { id: json.driverId } }),
      prisma.vehicle.findMany({ where: { driverId: json.driverId } }),
    ]);

    const base = AppointmentResponseDto.from(appointment);

    res.json({
      ...base,
      driver: driver
        ? {
          id: driver.id,
          firstName: driver.firstName,
          lastName: driver.lastName,
          email: driver.email,
          phone: driver.phone,
        }
        : null,
      vehicles: vehicles.map((v) => {
        const anyV = v as any;
        return {
          id: v.id,
          plateNumber: v.plateNumber,
          make: v.make,
          model: v.model,
          year: v.year,
          color: v.color,
          vin: anyV.vin ?? null,
          mileage: anyV.mileage ?? null,
          fuelType: anyV.fuelType ?? null,
        };
      }),
    });
  } catch (err: any) {
    const msg = err?.message ?? 'Internal error';
    res.status(msg === 'Appointment not found' ? 404 : 500).json({ error: msg });
  }
};

export const approveAppointment = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user.id as string;
    const id = String((req.params as any).id);
    const appointment = await approveUseCase.execute({ garageId, id });
    res.json(AppointmentResponseDto.from(appointment));
  } catch (err: any) {
    const code = err.message === 'Appointment not found' ? 404 : 400;
    res.status(code).json({ error: err.message });
  }
};

export const rejectAppointment = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user.id as string;
    const id = String((req.params as any).id);
    const appointment = await rejectUseCase.execute({ garageId, id });
    res.json(AppointmentResponseDto.from(appointment));
  } catch (err: any) {
    const code = err.message === 'Appointment not found' ? 404 : 400;
    res.status(code).json({ error: err.message });
  }
};

export const updateServiceStatus = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user.id as string;
    const id = String((req.params as any).id);
    const dto = UpdateServiceStatusRequestDto.from(req.body);

    const appointment = await updateStatusUseCase.execute({
      garageId,
      id,
      status: dto.status,
    });

    res.json(AppointmentResponseDto.from(appointment));
  } catch (err: any) {
    const code = err.message === 'Appointment not found' ? 404 : 400;
    res.status(code).json({ error: err.message });
  }
};
