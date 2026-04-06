import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyAccessToken } from '../../utils/jwt';

export const authenticate = async (req: FastifyRequest, reply: FastifyReply) => {
  const authHeader = req.headers.authorization;
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  const queryToken =
    !headerToken && typeof (req.query as any)?.token === 'string' ? (req.query as any).token : null;
  const token = headerToken || queryToken;
  if (!token) return reply.code(401).send({ message: 'Unauthorized' });
  try {
    const payload = verifyAccessToken(token) as { sub: string; email: string; role: string };
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
  } catch {
    return reply.code(401).send({ message: 'Invalid or expired token' });
  }
};
