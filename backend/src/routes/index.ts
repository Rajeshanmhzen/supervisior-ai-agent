import authRoutes from "../auth/auth.route";
import uploadRoutes from "../modules/upload/upload.route";
import userRoutes from "../user/user.route";
import { FastifyInstance } from "fastify";

export default async function registerRoutes(app: FastifyInstance) {
  app.register(authRoutes,   { prefix: "/auth" });
  app.register(uploadRoutes, { prefix: "/uploads" });
  app.register(userRoutes,   { prefix: "/user" });
}
