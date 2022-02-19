-- DropForeignKey
ALTER TABLE "PageLink" DROP CONSTRAINT "PageLink_linkFromId_fkey";

-- DropForeignKey
ALTER TABLE "PageLink" DROP CONSTRAINT "PageLink_linkToId_fkey";

-- AddForeignKey
ALTER TABLE "PageLink" ADD CONSTRAINT "PageLink_linkFromId_fkey" FOREIGN KEY ("linkFromId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageLink" ADD CONSTRAINT "PageLink_linkToId_fkey" FOREIGN KEY ("linkToId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
