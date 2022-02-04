/*
  Warnings:

  - The values [TO_VALIDATE] on the enum `BacklogStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BacklogStatus_new" AS ENUM ('DONE', 'IN_PROGRESS', 'SPRINT_BACKLOG', 'UNKNOWN');
ALTER TABLE "NotionStatusLink" ALTER COLUMN "status" TYPE "BacklogStatus_new" USING ("status"::text::"BacklogStatus_new");
ALTER TYPE "BacklogStatus" RENAME TO "BacklogStatus_old";
ALTER TYPE "BacklogStatus_new" RENAME TO "BacklogStatus";
DROP TYPE "BacklogStatus_old";
COMMIT;
