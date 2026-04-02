import { FastifyRequest, FastifyReply } from 'fastify';

export const authorizeAdmin = async (req: FastifyRequest, reply: FastifyReply) => {
  if (req.user?.role !== 'ADMIN') {
    return reply.code(403).send({ message: 'Forbidden' });
  }
};
