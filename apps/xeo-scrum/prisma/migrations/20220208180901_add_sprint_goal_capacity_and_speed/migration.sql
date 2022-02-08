-- AlterTable
ALTER TABLE "Sprint" ADD COLUMN     "sprintDevelopersAndCapacity" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "sprintGoal" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "teamSpeed" DOUBLE PRECISION NOT NULL DEFAULT 0;
