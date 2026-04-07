import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fs from 'fs';
import { submissionService } from './submission.service';

export const submissionController = (app: FastifyInstance) => {
  const service = submissionService(app);

  const addSubmission = async (req: FastifyRequest, reply: FastifyReply) => {
    const parts = req.parts();
    let file: any = null;
    const fields: Record<string, string> = {};

    for await (const part of parts) {
      if (part.type === 'file') {
        const buffer = await part.toBuffer();
        file = {
          filename: part.filename,
          mimetype: part.mimetype,
          buffer,
        };
      } else {
        const rawValue =
          typeof part.value === 'function' ? await (part.value as () => Promise<any>)() : part.value;
        fields[part.fieldname] = typeof rawValue === 'string' ? rawValue : String(rawValue ?? '');
      }
    }

    if (!file) {
      return reply.code(400).send({ message: 'No file uploaded' });
    }

    const semester = fields.semester;
    const university = fields.university;
    const userId = req.user?.id || fields.userId;

    if (!semester || !university) {
      return reply.code(400).send({ message: 'semester and university are required' });
    }
    if (!userId) {
      return reply.code(400).send({ message: 'userId is required' });
    }

    const record = await service.addSubmission(file, { semester, university, userId });
    return reply.code(201).send({ message: 'Submission added', submission: record });
  };

  const listSubmission = async (req: FastifyRequest, reply: FastifyReply) => {
    const query = req.query as { page?: string; limit?: string };
    const page = query?.page ? Number.parseInt(query.page, 10) : undefined;
    const limit = query?.limit ? Number.parseInt(query.limit, 10) : undefined;
    const options: { page?: number; limit?: number } = {};
    if (Number.isFinite(page)) options.page = page as number;
    if (Number.isFinite(limit)) options.limit = limit as number;
    const data = await service.listSubmission(options);
    return reply.code(200).send(data);
  };

  const deleteSubmission = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as any;
    await service.deleteSubmission(id);
    return reply.code(200).send({ ok: true });
  };

  const detailSubmission = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as any;
    const submission = await service.detailSubmission(id);
    if (!submission) return reply.code(404).send({ message: 'Submission not found' });
    return reply.code(200).send({ message: 'Submission found', submission });
  };

  const serveFile = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as any;
    const submission = await service.detailSubmission(id);
    if (!submission) return reply.code(404).send({ message: 'Submission not found' });
    if (!fs.existsSync(submission.path)) return reply.code(404).send({ message: 'File not found on disk' });
    const stream = fs.createReadStream(submission.path);
    reply.header('Content-Type', submission.mimeType);
    reply.header('Content-Disposition', `inline; filename="${submission.originalName}"`);
    return reply.send(stream);
  };

  return {
    addSubmission,
    listSubmission,
    detailSubmission,
    deleteSubmission,
    serveFile,
  };
};
