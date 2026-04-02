import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyAccessToken } from '../../utils/jwt';

export const authenticate = async (req: FastifyRequest, reply: FastifyReply) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return reply.code(401).send({ message: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) return reply.code(401).send({ message: 'Unauthorized' });
  try {
    const payload = verifyAccessToken(token) as { sub: string; email: string; role: string };
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
  } catch {
    return reply.code(401).send({ message: 'Invalid or expired token' });
  }
};
