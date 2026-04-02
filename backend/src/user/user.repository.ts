import { FastifyInstance } from "fastify";

export const userRepository = (app: FastifyInstance) => {
  const prisma = app.prisma;
  const findById = (id: string) => prisma.user.findUnique({ where: { id } });
  const findAll = () => prisma.user.findMany();
  const deleteById = (id: string) => prisma.user.delete({ where: { id } });
  const updateById = (id: string, data: any) =>
    prisma.user.update({ where: { id }, data });

  return { findById, findAll, deleteById, updateById };
};
