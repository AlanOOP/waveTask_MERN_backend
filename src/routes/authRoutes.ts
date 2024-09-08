import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authenticate } from '../middlewares/auth';

const router: Router = Router();

router.post('/auth/singUp', AuthController.singUp);
router.post('/auth/singIn', AuthController.singIn);
router.post('/auth/confirm-account', AuthController.confirmAccount);
router.post('/auth/request-code', AuthController.resendConfirmationEmail);
router.post('/auth/forgot-password', AuthController.forgotPassword);
router.post('/auth/validate-token', AuthController.validateToken);
router.post('/auth/update-password/:token', AuthController.updatePassword);
router.get('/auth/user', authenticate, AuthController.user);

export default router;