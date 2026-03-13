import { Request, Response } from 'express';
import { PrismaGarageProfileRepository } from '../../infrastructure/repositories/prisma-garage-profile.repository';
import { GetProfileUseCase } from '../../application/usecases/get-profile.usecase';
import { UpdateProfileUseCase } from '../../application/usecases/update-profile.usecase';
import type { GarageProfileDTO } from '../../application/dto/profile.dto';

const repository = new PrismaGarageProfileRepository();
const getProfileUseCase = new GetProfileUseCase(repository);
const updateProfileUseCase = new UpdateProfileUseCase(repository);

export const getProfile = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user?.id as string;
    if (!garageId) return res.status(401).json({ error: 'Unauthorized' });
    const profile = await getProfileUseCase.execute(garageId);
    res.json(profile);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(message === 'Garage not found' ? 404 : 400).json({ error: message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user?.id as string;
    if (!garageId) return res.status(401).json({ error: 'Unauthorized' });
    const data = req.body as GarageProfileDTO;
    const profile = await updateProfileUseCase.execute(garageId, data);
    res.json(profile);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    const status =
      message === 'Garage not found'
        ? 404
        : message === 'Email already in use' || message === 'Phone already in use'
          ? 409
          : 400;
    res.status(status).json({ error: message });
  }
};
