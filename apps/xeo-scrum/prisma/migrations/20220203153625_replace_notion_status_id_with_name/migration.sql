/*
  Warnings:

  - You are about to drop the column `notionStatusId` on the `NotionStatusLink` table. All the data in the column will be lost.
  - Added the required column `notionStatusColor` to the `NotionStatusLink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notionStatusName` to the `NotionStatusLink` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NotionStatusLink" DROP COLUMN "notionStatusId",
ADD COLUMN     "notionStatusColor" TEXT NOT NULL,
ADD COLUMN     "notionStatusName" TEXT NOT NULL;
