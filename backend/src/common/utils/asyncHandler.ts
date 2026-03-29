import { FastifyReply, FastifyRequest } from 'fastify';

export const asyncHandler =
  <TReq extends FastifyRequest, TRes extends FastifyReply>(
    fn: (req: TReq, reply: TRes) => Promise<any>
  ) =>
  async (req: TReq, reply: TRes) => {
    try {
      return await fn(req, reply);
    } catch (err: any) {
      const message = err?.message || 'Internal Server Error';
      return reply.code(400).send({ message });
    }
  };
