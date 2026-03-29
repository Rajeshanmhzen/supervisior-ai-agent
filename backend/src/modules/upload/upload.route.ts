import { FastifyInstance } from 'fastify';
import { asyncHandler } from '../../common/utils/asyncHandler';
import { uploadController } from './upload.controller';

export default async function uploadRoutes(app: FastifyInstance) {
  const controller = uploadController(app);
  app.get('/', asyncHandler(controller.list));
  app.get('/:id', asyncHandler(controller.getById));
  app.post('/', asyncHandler(controller.upload));
}
