-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "postedAt" DROP NOT NULL,
ALTER COLUMN "postedAt" DROP DEFAULT,
ALTER COLUMN "postedAt" SET DATA TYPE TEXT;
