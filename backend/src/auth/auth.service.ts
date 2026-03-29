import bcrypt from 'bcrypt';
import { FastifyInstance } from 'fastify';
import { authRepository } from './auth.repository';
import { hashToken, randomNumericCode, randomToken } from '../common/utils/crypto';
import { signAccessToken } from '../common/utils/jwt';
import { SignOptions } from 'jsonwebtoken';
import { Role } from '@prisma/client';
const REFRESH_TOKEN_TTL_DAYS = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 30);
const RESET_TOKEN_TTL_MIN = Number(process.env.RESET_TOKEN_TTL_MIN || 10);

const calcExpiry = (days: number) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);
const calcExpiryMinutes = (mins: number) => new Date(Date.now() + mins * 60 * 1000);

export const authService = (app: FastifyInstance) => {
  const repo = authRepository(app);

  const register = async (input: { fullName: string; email: string; password: string; role?: string }) => {
    const existing = await repo.findUserByEmail(input.email);
    if (existing) throw new Error('Email already in use');
    const passwordHash = await bcrypt.hash(input.password, 10);
    const normalizedRole = input.role?.toUpperCase();
    const role: Role = normalizedRole === 'ADMIN' ? 'ADMIN' : 'USER';
    const user = await repo.createUser({
      fullName: input.fullName,
      email: input.email,
      passwordHash,
      role,
    });
    const refreshRaw = randomToken(48);
    await repo.createRefreshToken({
      userId: user.id,
      tokenHash: hashToken(refreshRaw),
      expiresAt: calcExpiry(REFRESH_TOKEN_TTL_DAYS),
    });
    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    return { user, accessToken, refreshToken: refreshRaw };
  };

  const login = async (input: { email: string; password: string }) => {
    const user = await repo.findUserByEmail(input.email);
    if (!user) throw new Error('Invalid credentials');
    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new Error('Account temporarily locked. Try again later.');
    }
    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) {
      const failed = user.failedAttempts + 1;
      const lockUntil = failed >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;
      await repo.updateUser(user.id, { failedAttempts: failed, lockUntil });
      throw new Error('Invalid credentials');
    }
    await repo.updateUser(user.id, { failedAttempts: 0, lockUntil: null });
    const refreshRaw = randomToken(48);
    await repo.createRefreshToken({
      userId: user.id,
      tokenHash: hashToken(refreshRaw),
      expiresAt: calcExpiry(REFRESH_TOKEN_TTL_DAYS),
    });
    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    return { user, accessToken, refreshToken: refreshRaw };
  };

  const refresh = async (refreshToken: string) => {
    const tokenHash = hashToken(refreshToken);
    const record = await repo.findRefreshToken(tokenHash);
    if (!record) throw new Error('Invalid refresh token');
    if (record.expiresAt < new Date()) {
      await repo.deleteRefreshToken(tokenHash);
      throw new Error('Refresh token expired');
    }
    await repo.deleteRefreshToken(tokenHash);
    const newRefresh = randomToken(48);
    await repo.createRefreshToken({
      userId: record.userId,
      tokenHash: hashToken(newRefresh),
      expiresAt: calcExpiry(REFRESH_TOKEN_TTL_DAYS),
    });
    const user = await app.prisma.user.findUnique({ where: { id: record.userId } });
    if (!user) throw new Error('User not found');
    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    return { accessToken, refreshToken: newRefresh };
  };

  const logout = async (refreshToken: string) => {
    const tokenHash = hashToken(refreshToken);
    const record = await repo.findRefreshToken(tokenHash);
    if (record) {
      await repo.deleteRefreshToken(tokenHash);
    }
  };

  const forgotPassword = async (email: string) => {
    const user = await repo.findUserByEmail(email);
    if (!user) return { ok: true };
    const log = await app.prisma.emailLog.create({
      data: { email: user.email, type: 'RESET', status: 'PENDING' },
    });
    try {
      await repo.deletePasswordResetTokensByUser(user.id);
      const code = randomNumericCode(6);
      await repo.createPasswordResetToken({
        userId: user.id,
        tokenHash: hashToken(code),
        expiresAt: calcExpiryMinutes(RESET_TOKEN_TTL_MIN),
      });
      await app.prisma.emailLog.update({
        where: { id: log.id },
        data: { status: 'SEND' },
      });
      return { ok: true, code };
    } catch (err) {
      await app.prisma.emailLog.update({
        where: { id: log.id },
        data: { status: 'FAILED' },
      });
      throw err;
    }
  };

  const verifyResetCode = async (email: string, code: string) => {
    const user = await repo.findUserByEmail(email);
    if (!user) throw new Error('Invalid code');
    const record = await repo.findPasswordResetToken(hashToken(code));
    if (!record || record.userId !== user.id) throw new Error('Invalid code');
    if (record.usedAt) throw new Error('Code already used');
    if (record.expiresAt < new Date()) throw new Error('Code expired');
    return { ok: true };
  };

  const resetPassword = async (email: string, code: string, newPassword: string) => {
    const user = await repo.findUserByEmail(email);
    if (!user) throw new Error('Invalid code');
    const record = await repo.findPasswordResetToken(hashToken(code));
    if (!record || record.userId !== user.id) throw new Error('Invalid code');
    if (record.usedAt) throw new Error('Code already used');
    if (record.expiresAt < new Date()) throw new Error('Code expired');
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await repo.updateUser(user.id, { passwordHash });
    await repo.deletePasswordResetTokenById(record.id);
    return { ok: true };
  };

  return {
    register,
    login,
    refresh,
    logout,
    forgotPassword,
    verifyResetCode,
    resetPassword,
  };
};
