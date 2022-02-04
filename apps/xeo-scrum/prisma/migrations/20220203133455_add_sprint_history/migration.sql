-- CreateTable
CREATE TABLE "SprintHistory" (
    "id" TEXT NOT NULL,
    "sprintId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SprintHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SprintStatusHistory" (
    "id" TEXT NOT NULL,
    "notionStatusLinkId" TEXT NOT NULL,
    "sprintHistoryId" TEXT NOT NULL,
    "pointsInStatus" INTEGER NOT NULL,

    CONSTRAINT "SprintStatusHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SprintHistory" ADD CONSTRAINT "SprintHistory_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SprintStatusHistory" ADD CONSTRAINT "SprintStatusHistory_notionStatusLinkId_fkey" FOREIGN KEY ("notionStatusLinkId") REFERENCES "NotionStatusLink"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SprintStatusHistory" ADD CONSTRAINT "SprintStatusHistory_sprintHistoryId_fkey" FOREIGN KEY ("sprintHistoryId") REFERENCES "SprintHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
