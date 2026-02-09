import authRoutes from '../modules/auth/presentation/routes.js';
import adminRoutes from '../modules/admin/presentation/routes.js';
import driverRoutes from '../modules/driver/presentation/routes.js';
import garageRoutes from '../modules/garage/presentation/routes.js';
import communityRoutes from '../modules/community/presentation/routes.js';
import educationRoutes from '../modules/education/presentation/routes.js';
import appointmentsRoutes from '../modules/appointments/presentation/routes.js';
import servicesRoutes from '../modules/services/presentation/routes.js';
import vehiclesRoutes from '../modules/vehicles/presentation/routes.js';
import maintenanceRoutes from '../modules/maintenance/presentation/routes.js';
import notificationsRoutes from '../modules/notifications/presentation/routes.js';
import aiRoutes from '../modules/ai/presentation/routes.js';
import onsiteAssistanceRoutes from '../modules/onsiteAssistance/presentation/routes.js';
import ratingsRoutes from '../modules/ratings/presentation/routes.js';
import settingsRoutes from '../modules/settings/presentation/routes.js';

/**
 * Registers all module routes on the Express app.
 */
export function registerRoutes(app) {
  app.use('/auth', authRoutes);
  app.use('/admin', adminRoutes);
  app.use('/driver', driverRoutes);
  app.use('/garage', garageRoutes);
  app.use('/community', communityRoutes);
  app.use('/education', educationRoutes);
  app.use('/appointments', appointmentsRoutes);
  app.use('/services', servicesRoutes);
  app.use('/vehicles', vehiclesRoutes);
  app.use('/maintenance', maintenanceRoutes);
  app.use('/notifications', notificationsRoutes);
  app.use('/ai', aiRoutes);
  app.use('/onsite-assistance', onsiteAssistanceRoutes);
  app.use('/ratings', ratingsRoutes);
  app.use('/settings', settingsRoutes);
}
