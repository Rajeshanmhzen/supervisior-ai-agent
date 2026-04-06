import { FastifyInstance } from "fastify";

export const userRepository = (app: FastifyInstance) => {
  const prisma = app.prisma;
  const findById = (id: string) => prisma.user.findUnique({ where: { id } });
  const findAll = (skip: number, take: number) => prisma.user.findMany({ skip, take, orderBy: { createdAt: 'desc' } });
  const countAll = () => prisma.user.count();
  const deleteById = (id: string) => prisma.user.delete({ where: { id } });
  const updateById = (id: string, data: any) =>
    prisma.user.update({ where: { id }, data });

  return { findById, findAll, countAll, deleteById, updateById };
};
