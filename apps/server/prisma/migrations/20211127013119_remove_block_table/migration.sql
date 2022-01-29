/*
  Warnings:

  - You are about to drop the `Block` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "Block_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "Block_parentBlockId_fkey";

-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "Block_parentPageId_fkey";

-- DropForeignKey
ALTER TABLE "Block" DROP CONSTRAINT "Block_updatedById_fkey";

-- DropTable
DROP TABLE "Block";
