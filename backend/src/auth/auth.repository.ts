import { FastifyInstance } from 'fastify';
import { Role } from '@prisma/client';

export const authRepository = (app: FastifyInstance) => {
  const prisma = app.prisma;

  const findUserByEmail = (email: string) => prisma.user.findUnique({ where: { email } });

  const createUser = (data: { fullName: string; email: string; passwordHash: string; role?: Role }) =>
    prisma.user.create({ data });

  const updateUser = (id: string, data: any) => prisma.user.update({ where: { id }, data });

  const createRefreshToken = (data: { userId: string; tokenHash: string; expiresAt: Date }) =>
    prisma.refreshToken.create({ data });

  const findRefreshToken = (tokenHash: string) =>
    prisma.refreshToken.findUnique({ where: { tokenHash } });

  const deleteRefreshToken = (tokenHash: string) =>
    prisma.refreshToken.delete({ where: { tokenHash } });

  const createPasswordResetToken = (data: { userId: string; tokenHash: string; expiresAt: Date }) =>
    prisma.passwordResetToken.create({ data });

  const findPasswordResetToken = (tokenHash: string) =>
    prisma.passwordResetToken.findUnique({ where: { tokenHash } });

  const markPasswordResetUsed = (id: string) =>
    prisma.passwordResetToken.update({ where: { id }, data: { usedAt: new Date() } });

  const deletePasswordResetTokensByUser = (userId: string) =>
    prisma.passwordResetToken.deleteMany({ where: { userId } });

  const deletePasswordResetTokenById = (id: string) =>
    prisma.passwordResetToken.delete({ where: { id } });

  return {
    findUserByEmail,
    createUser,
    updateUser,
    createRefreshToken,
    findRefreshToken,
    deleteRefreshToken,
    createPasswordResetToken,
    findPasswordResetToken,
    markPasswordResetUsed,
    deletePasswordResetTokensByUser,
    deletePasswordResetTokenById,
  };
};
