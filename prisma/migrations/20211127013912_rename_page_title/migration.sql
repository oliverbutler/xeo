/*
  Warnings:

  - You are about to drop the column `rawText` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `richText` on the `Page` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Page" DROP COLUMN "rawText",
DROP COLUMN "richText",
ADD COLUMN     "title" JSONB NOT NULL DEFAULT E'{}',
ADD COLUMN     "titlePlainText" TEXT NOT NULL DEFAULT E'';
