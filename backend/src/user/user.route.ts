import { FastifyInstance } from "fastify";
import { userController } from "./user.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { authenticate } from "../common/hooks/authenticate";
import { authorizeAdmin } from "../common/hooks/authorize";

export default async function userRoutes(app: FastifyInstance) {
  const controller = userController(app);

  // admin only
  app.get('/list',           { preHandler: [authenticate, authorizeAdmin] }, asyncHandler(controller.listUser));
  app.delete('/delete/:id',  { preHandler: [authenticate, authorizeAdmin] }, asyncHandler(controller.deleteUser));

  // logged in user only
  app.get('/detail/:id',             { preHandler: [authenticate] }, asyncHandler(controller.detailUser));
  app.put('/edit/:id',               { preHandler: [authenticate] }, asyncHandler(controller.editUser));
  app.put('/edit/:id/profile-image', { preHandler: [authenticate] }, asyncHandler(controller.editProfileImage));
  app.put('/edit/:id/password',      { preHandler: [authenticate] }, asyncHandler(controller.editUserPassword));
}