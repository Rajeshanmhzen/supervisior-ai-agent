-- Add progress column to FileUpload
ALTER TABLE "FileUpload"
ADD COLUMN "progress" INTEGER NOT NULL DEFAULT 0;

