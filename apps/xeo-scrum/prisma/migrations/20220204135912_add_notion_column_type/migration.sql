-- CreateEnum
CREATE TYPE "NotionColumnType" AS ENUM ('SELECT', 'MULTI_SELECT');

-- AlterTable
ALTER TABLE "Backlog" ADD COLUMN     "notionColumnType" "NotionColumnType" NOT NULL DEFAULT E'SELECT';
