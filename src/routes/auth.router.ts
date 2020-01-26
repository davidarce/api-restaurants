import { Router } from 'express';
import AuthController from '../controller/auth.controller';
import { validateJwtToken } from '../middlewares/auth.middleware';

const authRouter = Router();

authRouter.post('/login', AuthController.login);
authRouter.post('/logout', [validateJwtToken], AuthController.logout);
authRouter.post('/change-password', [validateJwtToken], AuthController.changePassword);

export default authRouter;

