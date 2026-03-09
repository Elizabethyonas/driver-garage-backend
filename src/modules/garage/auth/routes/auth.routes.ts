import { Router, Request, Response, NextFunction } from 'express';
import { signup, login } from '../controllers/auth.controller';
import { logout } from '../../../common/auth/logout.controller';
import { uploadBusinessLicense } from '../middleware/upload-license.middleware';
import { garageSignupValidator } from '../validators/signup.validator';
import { validate } from '../../../../core/middleware/validate.middleware';

const router = Router();

function handleMulterError(err: unknown, _req: Request, res: Response, next: NextFunction) {
  if (err) {
    const message = err instanceof Error ? err.message : 'File upload failed';
    return res.status(400).json({ error: message });
  }
  next();
}

router.post(
  '/signup',
  (req: Request, res: Response, next: NextFunction) => {
    uploadBusinessLicense(req, res, (err: unknown) => {
      if (err) return handleMulterError(err, req, res, next);
      next();
    });
  },
  garageSignupValidator,
  validate,
  signup
);
router.post('/login', login);
router.post('/logout', logout);

export default router;