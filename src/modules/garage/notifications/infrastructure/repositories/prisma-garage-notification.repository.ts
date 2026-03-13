import { prisma } from '../../../../../infrastructure/prisma/prisma.client';
import type { IGarageNotificationRepository } from '../../domain/repositories/garage-notification.repository.interface';

export class PrismaGarageNotificationRepository implements IGarageNotificationRepository {
  async listByGarageId(garageId: string): Promise<unknown[]> {
    return prisma.garageNotification.findMany({
      where: { garageId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
