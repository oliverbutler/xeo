/*
  Warnings:

  - You are about to drop the column `pointsColumnId` on the `Backlog` table. All the data in the column will be lost.
  - You are about to drop the column `sprintColumnId` on the `Backlog` table. All the data in the column will be lost.
  - You are about to drop the column `statusColumnId` on the `Backlog` table. All the data in the column will be lost.
  - You are about to drop the column `notionSprintId` on the `Sprint` table. All the data in the column will be lost.
  - Added the required column `pointsColumnName` to the `Backlog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sprintColumnName` to the `Backlog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusColumnName` to the `Backlog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notionSprintValue` to the `Sprint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Backlog" DROP COLUMN "pointsColumnId",
DROP COLUMN "sprintColumnId",
DROP COLUMN "statusColumnId",
ADD COLUMN     "currentSprintId" TEXT,
ADD COLUMN     "pointsColumnName" TEXT NOT NULL,
ADD COLUMN     "sprintColumnName" TEXT NOT NULL,
ADD COLUMN     "statusColumnName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Sprint" DROP COLUMN "notionSprintId",
ADD COLUMN     "notionSprintValue" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Backlog" ADD CONSTRAINT "Backlog_currentSprintId_fkey" FOREIGN KEY ("currentSprintId") REFERENCES "Sprint"("id") ON DELETE SET NULL ON UPDATE CASCADE;
