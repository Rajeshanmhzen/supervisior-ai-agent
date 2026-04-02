import bcrypt from 'bcrypt';
import { FastifyInstance } from "fastify";
import { userRepository } from "./user.repository";

export const userService = (app: FastifyInstance) => {
  const repo = userRepository(app);

  const listUser = async () => {
    const existing = await repo.findAll();
    if (!existing) throw new Error("No user found");
    return existing;
  };
  const detailUser = async (id: string) => {
    const user = await repo.findById(id);
    if (!user) throw new Error("User not found");
    return user;
  };
  const deleteUser = async (id: string) => {
    const user = await repo.findById(id);
    if (!user) throw new Error("User not found");
    await repo.deleteById(id);
  };
  const editUser = async (id: string, data: any) => {
    const user = await repo.findById(id);
    if (!user) throw new Error("User not found");
    await repo.updateById(id, data);
  };
  const editProfileImage = async (id: string, imageUrl: string) => {
    const user = await repo.findById(id);
    if(!user) throw new Error("User not found");
    await repo.updateById(id, { profilePic: imageUrl });
  };
  const editUserPassword = async (id: string, currentPassword: string, newPassword: string) => {
    const user = await repo.findById(id);
    if(!user) throw new Error("User not found");
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if(!isMatch) throw new Error("Current password is incorrect");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await repo.updateById(id, { passwordHash: hashedPassword });
  }
  return { listUser, detailUser, deleteUser, editUser, editProfileImage, editUserPassword };
}

