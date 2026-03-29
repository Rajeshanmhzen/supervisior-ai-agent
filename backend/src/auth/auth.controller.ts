import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { authService } from './auth.service';

const setRefreshCookie = (reply: FastifyReply, token: string) => {
  reply.setCookie('refreshToken', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: false,
  });
};

export const authController = (app: FastifyInstance) => {
  const service = authService(app);

  const register = async (req: FastifyRequest, reply: FastifyReply) => {
    const { fullName, email, password, role } = req.body as any;
    const result = await service.register({ fullName, email, password, role });
    setRefreshCookie(reply, result.refreshToken);
    return reply.send({ user: result.user, accessToken: result.accessToken });
  };

  const login = async (req: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = req.body as any;
    const result = await service.login({ email, password });
    setRefreshCookie(reply, result.refreshToken);
    return reply.send({ user: result.user, accessToken: result.accessToken });
  };

  const refresh = async (req: FastifyRequest, reply: FastifyReply) => {
    const refreshToken = (req.cookies as any).refreshToken;
    if (!refreshToken) return reply.code(401).send({ message: 'No refresh token' });
    const result = await service.refresh(refreshToken);
    setRefreshCookie(reply, result.refreshToken);
    return reply.send({ accessToken: result.accessToken });
  };

  const logout = async (req: FastifyRequest, reply: FastifyReply) => {
    const refreshToken = (req.cookies as any).refreshToken;
    if (refreshToken) await service.logout(refreshToken);
    reply.clearCookie('refreshToken', { path: '/' });
    return reply.send({ ok: true });
  };

  const forgotPassword = async (req: FastifyRequest, reply: FastifyReply) => {
    const { email } = req.body as any;
    const result = await service.forgotPassword(email);
    return reply.send(result);
  };

  const verifyCode = async (req: FastifyRequest, reply: FastifyReply) => {
    const { email, code } = req.body as any;
    const result = await service.verifyResetCode(email, code);
    return reply.send(result);
  };

  const resetPassword = async (req: FastifyRequest, reply: FastifyReply) => {
    const { email, code, password } = req.body as any;
    const result = await service.resetPassword(email, code, password);
    return reply.send(result);
  };

  return {
    register,
    login,
    refresh,
    logout,
    forgotPassword,
    verifyCode,
    resetPassword,
  };
};
