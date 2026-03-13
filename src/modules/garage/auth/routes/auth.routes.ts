import { Router } from 'express';
import { signup, login, sendOtp, verifyOtp } from '../controllers/auth.controller';
import { logout } from '../../../common/auth/logout.controller';
import { multipartForm } from '../../../../core/middleware/upload.middleware';

const router = Router();

router.post('/signup', multipartForm, signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

export default router;