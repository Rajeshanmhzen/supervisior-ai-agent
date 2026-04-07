import { FastifyInstance } from 'fastify';
import { asyncHandler } from '../utils/asyncHandler';
import { submissionController } from './submission.controller';
import { authenticate } from '../common/hooks/authenticate';
import { registerSubmissionSocket } from '../modules/realtime/submission.socket';

export default async function submissionRoutes(app: FastifyInstance) {
  const controller = submissionController(app);
  app.get('/list',          { preHandler: [authenticate] }, asyncHandler(controller.listSubmission));
  app.get('/detail/:id',    { preHandler: [authenticate] }, asyncHandler(controller.detailSubmission));
  app.get('/file/:id',      { preHandler: [authenticate] }, asyncHandler(controller.serveFile));
  app.post('/add',          { preHandler: [authenticate] }, asyncHandler(controller.addSubmission));
  app.delete('/delete/:id', { preHandler: [authenticate] }, asyncHandler(controller.deleteSubmission));

  app.get(
    '/stream',
    { websocket: true, preHandler: [authenticate] },
    (connection, req) => {
      const userId = req.user?.id;
      if (!userId) {
        connection.socket.close();
        return;
      }
      registerSubmissionSocket(userId, connection.socket as any);
      connection.socket.send(JSON.stringify({ type: 'connected' }));
    }
  );
}
