import { FastifyInstance } from 'fastify';
import { authController } from './auth.controller';
import { asyncHandler } from '../utils/asyncHandler';

export default async function authRoutes(app: FastifyInstance) {
  const controller = authController(app);

  app.post('/register', asyncHandler(controller.register));
  app.post('/login', asyncHandler(controller.login));
  app.post('/refresh', asyncHandler(controller.refresh));
  app.post('/logout', asyncHandler(controller.logout));
  app.post('/forgot-password', asyncHandler(controller.forgotPassword));
  app.post('/verify-code', asyncHandler(controller.verifyCode));
  app.post('/reset-password', asyncHandler(controller.resetPassword));
}