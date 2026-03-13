import { Request, Response } from 'express';
import { PrismaGarageNotificationRepository } from '../../infrastructure/repositories/prisma-garage-notification.repository';
import { ListNotificationsUseCase } from '../../application/usecases/list-notifications.usecase';

const repository = new PrismaGarageNotificationRepository();
const listUseCase = new ListNotificationsUseCase(repository);

export const listNotifications = async (req: Request, res: Response) => {
  try {
    const garageId = (req as any).user?.id as string;
    if (!garageId) return res.status(401).json({ error: 'Unauthorized' });
    const notifications = await listUseCase.execute(garageId);
    res.json(notifications);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};
