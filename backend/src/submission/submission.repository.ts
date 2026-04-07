import { FastifyInstance } from 'fastify';

export const submissionRepository = (app: FastifyInstance) => {
  const prisma = app.prisma;

  const addSubmission = (data: {
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

  const listSubmission = (skip: number, take: number) =>
    prisma.fileUpload.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });

  const countSubmission = () => prisma.fileUpload.count();

  const detailSubmission = (id: string) => prisma.fileUpload.findUnique({ where: { id } });

  const editSubmission = (id: string, data: any) =>
    prisma.fileUpload.update({ where: { id }, data });

  const deleteSubmission = (id: string) => prisma.fileUpload.delete({ where: { id } });

  return {
    addSubmission,
    listSubmission,
    countSubmission,
    detailSubmission,
    editSubmission,
    deleteSubmission,
  };
};
