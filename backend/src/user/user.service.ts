import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';
import { promises as fsp } from 'fs';
import { pipeline } from 'stream/promises';
import { FastifyInstance } from "fastify";
import { userRepository } from "./user.repository";
import { getPaginationParams, buildPaginatedResult, PaginationOptions } from '../utils/pagination';
import { randomToken } from '../utils/crypto';

const PROFILE_DIR = path.resolve(process.cwd(), 'upload', 'profiles');
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const userService = (app: FastifyInstance) => {
  const repo = userRepository(app);

  const listUser = async (options?: PaginationOptions) => {
    const { page, limit, skip } = getPaginationParams(options);
    const [users, total] = await Promise.all([
      repo.findAll(skip, limit),
      repo.countAll(),
    ]);
    return buildPaginatedResult(users, total, page, limit);
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
  const editProfileImage = async (id: string, file: any) => {
    const user = await repo.findById(id);
    if(!user) throw new Error("User not found");
    if(!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) throw new Error('Only JPEG, PNG and WebP images are allowed');
    await fsp.mkdir(PROFILE_DIR, { recursive: true });
    const ext = path.extname(file.filename || '');
    const storedName = `${randomToken(12)}${ext}`;
    const filePath = path.join(PROFILE_DIR, storedName);
    await pipeline(file.file, fs.createWriteStream(filePath));
    if(user.profilePic) {
      const oldPath = path.resolve(process.cwd(), user.profilePic);
      await fsp.unlink(oldPath).catch(() => {});
    }
    const profilePic = path.join('upload', 'profiles', storedName);
    await repo.updateById(id, { profilePic });
    return { profilePic };
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

