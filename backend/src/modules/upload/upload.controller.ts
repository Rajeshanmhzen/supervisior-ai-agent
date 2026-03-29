import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { uploadService } from './upload.service';

export const uploadController = (app: FastifyInstance) => {
  const service = uploadService(app);

  const upload = async (req: FastifyRequest, reply: FastifyReply) => {
    const file = await (req as any).file();
    if (!file) {
      return reply.code(400).send({ message: 'No file uploaded' });
    }

    const fields = file.fields || {};
    const semester = typeof fields.semester?.value === 'string' ? fields.semester.value : undefined;
    const university = typeof fields.university?.value === 'string' ? fields.university.value : undefined;
    const userId = typeof fields.userId?.value === 'string' ? fields.userId.value : undefined;

    if (!semester || !university || !userId) {
      return reply.code(400).send({ message: 'semester, university, and userId are required' });
    }

    const record = await service.saveUpload(file, { semester, university, userId });
    return reply.send({ file: record });
  };

  const list = async (req: FastifyRequest, reply: FastifyReply) => {
    const query = req.query as { page?: string; limit?: string };
    const page = query?.page ? Number.parseInt(query.page, 10) : undefined;
    const limit = query?.limit ? Number.parseInt(query.limit, 10) : undefined;

    const options: { page?: number; limit?: number } = {};
    if (Number.isFinite(page)) options.page = page as number;
    if (Number.isFinite(limit)) options.limit = limit as number;

    const data = await service.listUploads(options);

    return reply.send(data);
  };

  const getById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as any;
    const file = await service.getUploadById(id);
    if (!file) return reply.code(404).send({ message: 'File not found' });
    return reply.send({ file });
  };

  return {
    upload,
    list,
    getById,
  };
};
