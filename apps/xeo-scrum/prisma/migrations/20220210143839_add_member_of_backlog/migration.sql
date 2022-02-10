/*
  Warnings:

  - You are about to drop the `_backlogMembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `_backlogMembers`;

-- CreateTable
CREATE TABLE `MemberOfBacklog` (
    `userId` VARCHAR(191) NOT NULL,
    `backlogId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`userId`, `backlogId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
