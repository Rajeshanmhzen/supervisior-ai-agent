import { FastifyInstance } from "fastify";
import { userService } from "./user.service";

export const userController = (app: FastifyInstance) => {
  const service = userService(app); 

  const listUser = async (req: any, reply: any) => {
    const result = await service.listUser();
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
    const { imageUrl } = req.body;
    await service.editProfileImage(id, imageUrl);
    return reply.code(200).send({ ok: true });
  };

  const editUserPassword = async (req: any, reply: any) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    await service.editUserPassword(id, currentPassword, newPassword);
    return reply.code(200).send({ ok: true });
  };
  return { listUser, detailUser, deleteUser, editUser, editProfileImage, editUserPassword };
};