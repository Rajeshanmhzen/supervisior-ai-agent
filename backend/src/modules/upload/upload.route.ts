import { FastifyInstance } from 'fastify';
import { asyncHandler } from '../../utils/asyncHandler';
import { uploadController } from './upload.controller';
import { authenticate } from '../../common/hooks/authenticate';

export default async function uploadRoutes(app: FastifyInstance) {
  const controller = uploadController(app);
  app.get('/',    { preHandler: [authenticate] }, asyncHandler(controller.list));
  app.get('/:id', { preHandler: [authenticate] }, asyncHandler(controller.getById));
  app.post('/',   { preHandler: [authenticate] }, asyncHandler(controller.upload));
}
