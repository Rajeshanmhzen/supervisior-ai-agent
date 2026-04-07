import dotenv from 'dotenv';
import './types/fastify';
import fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from 'path';
import websocket from '@fastify/websocket';
import prismaPlugin from './plugins/prisma';
import routes from './routes';

dotenv.config({ quiet: true });

const app = fastify();
app.register(cors, {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
app.register(prismaPlugin);
app.register(cookie);
app.register(multipart, {
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});
app.register(websocket);
app.register(fastifyStatic, {
  root: path.join(process.cwd(), 'upload'),
  prefix: '/upload/',
  decorateReply: false,
});
app.register(routes, { prefix: '/api/v1' });


export default app;
