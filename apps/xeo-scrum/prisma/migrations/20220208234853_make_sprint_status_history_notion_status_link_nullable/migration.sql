-- DropForeignKey
ALTER TABLE "SprintStatusHistory" DROP CONSTRAINT "SprintStatusHistory_notionStatusLinkId_fkey";

-- AlterTable
ALTER TABLE "SprintStatusHistory" ALTER COLUMN "notionStatusLinkId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SprintStatusHistory" ADD CONSTRAINT "SprintStatusHistory_notionStatusLinkId_fkey" FOREIGN KEY ("notionStatusLinkId") REFERENCES "NotionStatusLink"("id") ON DELETE SET NULL ON UPDATE CASCADE;
