import dotenv from 'dotenv';
import './types/fastify';
import fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import multipart from '@fastify/multipart';
import prismaPlugin from './plugins/prisma';
import routes from './routes';

dotenv.config();

const app = fastify();
app.register(cors, {
  origin: 'http://localhost:5173',
  credentials: true,
});
app.register(prismaPlugin);
app.register(cookie);
app.register(multipart, {
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});
app.register(routes, { prefix: '/api/v1' });


export default app;
