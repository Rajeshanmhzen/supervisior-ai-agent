/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('PENDING', 'SEND', 'FAILED', 'RESENDING');

-- DropForeignKey
ALTER TABLE "FileUpload" DROP CONSTRAINT "FileUpload_userId_fkey";

-- AlterTable
ALTER TABLE "FileUpload" ADD COLUMN     "analysisResult" JSONB,
ADD COLUMN     "errorMessage" TEXT,
ADD COLUMN     "semester" TEXT NOT NULL DEFAULT 'UNKNOWN',
ADD COLUMN     "status" "FileStatus" NOT NULL DEFAULT 'UPLOADED',
ADD COLUMN     "university" TEXT NOT NULL DEFAULT 'UNKNOWN',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" "EmailStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FileUpload_userId_idx" ON "FileUpload"("userId");

-- CreateIndex
CREATE INDEX "FileUpload_status_idx" ON "FileUpload"("status");

-- CreateIndex
CREATE INDEX "FileUpload_createdAt_idx" ON "FileUpload"("createdAt");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "VerificationToken_userId_idx" ON "VerificationToken"("userId");

-- AddForeignKey
ALTER TABLE "FileUpload" ADD CONSTRAINT "FileUpload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
