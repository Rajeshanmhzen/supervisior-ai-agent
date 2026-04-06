import authRoutes from "../auth/auth.route";
import submissionRoutes from "../submission/submission.route";
import userRoutes from "../user/user.route";
import { FastifyInstance } from "fastify";

export default async function registerRoutes(app: FastifyInstance) {
  app.register(authRoutes,       { prefix: "/auth" });
  app.register(submissionRoutes, { prefix: "/submissions" });
  app.register(userRoutes,       { prefix: "/user" });
}
