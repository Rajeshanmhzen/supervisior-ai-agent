import { PrismaClient } from '@prisma/client';
import '@fastify/cookie';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
  interface FastifyRequest {
    user: { id: string; email: string; role: string } | null;
  }
}

export {};
