import { PrismaClient } from '@prisma/client';
import '@fastify/cookie';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export {};
