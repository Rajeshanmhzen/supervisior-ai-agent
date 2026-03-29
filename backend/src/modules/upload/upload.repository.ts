import { FastifyInstance } from 'fastify';

export const uploadRepository = (app: FastifyInstance) => {
  const prisma = app.prisma;

  const createFile = (data: {
    userId?: string;
    originalName: string;
    storedName: string;
    mimeType: string;
    size: number;
    path: string;
    semester: string;
    university: string;
    status: 'UPLOADED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  }) => prisma.fileUpload.create({ data });

  const getAllFiles = () => prisma.fileUpload.findMany({ orderBy: { createdAt: 'desc' } });

  const getFilesPaged = (skip: number, take: number) =>
    prisma.fileUpload.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });

  const countFiles = () => prisma.fileUpload.count();

  const getFileById = (id: string) => prisma.fileUpload.findUnique({ where: { id } });

  const updateStatus = (id: string, data: any) =>
    prisma.fileUpload.update({ where: { id }, data });

  return {
    createFile,
    getAllFiles,
    getFilesPaged,
    countFiles,
    getFileById,
    updateStatus,
  };
};
