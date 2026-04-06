import { FastifyInstance } from "fastify";
import { userService } from "./user.service";

export const userController = (app: FastifyInstance) => {
  const service = userService(app); 

  const listUser = async (req: any, reply: any) => {
    const { page, limit } = req.query as { page?: string; limit?: string };
    const result = await service.listUser({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
    return reply.code(200).send(result);
  };

  const detailUser = async (req: any, reply: any) => {
    const { id } = req.params;
    const result = await service.detailUser(id);
    return reply.code(200).send(result);
  };

  const deleteUser = async (req: any, reply: any) => {
    const { id } = req.params;
    await service.deleteUser(id);
    return reply.code(200).send({ ok: true });
  };

  const editUser = async (req: any, reply: any) => {
    const { id } = req.params;
    const data = req.body;
    await service.editUser(id, data);
    return reply.code(200).send({ ok: true });
  };

  const editProfileImage = async (req: any, reply: any) => {
    const { id } = req.params;
    const file = await req.file();
    if(!file) return reply.code(400).send({ message: 'No file uploaded' });
    const result = await service.editProfileImage(id, file);
    return reply.code(200).send(result);
  };

  const editUserPassword = async (req: any, reply: any) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    await service.editUserPassword(id, currentPassword, newPassword);
    return reply.code(200).send({ ok: true });
  };
  return { listUser, detailUser, deleteUser, editUser, editProfileImage, editUserPassword };
};