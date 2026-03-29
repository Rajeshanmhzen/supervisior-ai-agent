import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
const prisma = new PrismaClient();

export default fp(async (fastify: FastifyInstance, opts:FastifyPluginOptions) => {
    await prisma.$connect();
  fastify.decorate('prisma', prisma);
  await fastify.addHook('onClose', async () => {
    await prisma.$disconnect();
  });
});