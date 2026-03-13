import { Router } from 'express';
import { verifyGarageJWT } from '../../../../../core/middleware/auth/jwt.middleware';
import { getProfile, updateProfile } from '../controllers/garage-profile.controller';

const router = Router();

router.use(verifyGarageJWT);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;
