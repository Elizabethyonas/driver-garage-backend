export interface IGarageNotificationRepository {
  listByGarageId(garageId: string): Promise<unknown[]>;
}
