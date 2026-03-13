import { Router } from 'express';
import { verifyGarageJWT } from '../../../../../core/middleware/auth/jwt.middleware';
import { listNotifications } from '../controllers/garage-notifications.controller';

const router = Router();

router.use(verifyGarageJWT);
router.get('/', listNotifications);

export default router;
