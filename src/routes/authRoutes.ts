import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router: Router = Router();

router.post('/auth/singUp', AuthController.singUp);
router.post('/auth/singIn', AuthController.singIn);
router.post('/auth/confirm-account', AuthController.confirmAccount);
router.post('/auth/request-code', AuthController.resendConfirmationEmail);
router.post('/auth/forgot-password', AuthController.forgotPassword);

export default router;