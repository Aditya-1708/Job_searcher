-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Employee', 'Company');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'Employee';
