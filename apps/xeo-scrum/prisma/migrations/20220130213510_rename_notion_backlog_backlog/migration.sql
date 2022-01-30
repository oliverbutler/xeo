/*
  Warnings:

  - You are about to drop the column `notionBacklogId` on the `NotionStatusLink` table. All the data in the column will be lost.
  - You are about to drop the `NotionBacklog` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `backlogId` to the `NotionStatusLink` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `NotionStatusLink` DROP COLUMN `notionBacklogId`,
    ADD COLUMN `backlogId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `NotionBacklog`;

-- CreateTable
CREATE TABLE `Backlog` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `databaseId` VARCHAR(191) NOT NULL,
    `databaseName` VARCHAR(191) NOT NULL,
    `pointsColumnId` VARCHAR(191) NOT NULL,
    `statusColumnId` VARCHAR(191) NOT NULL,
    `sprintColumnId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
