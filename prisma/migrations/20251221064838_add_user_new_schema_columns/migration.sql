-- AlterTable
ALTER TABLE "User" ADD COLUMN     "codeforcesUrl" TEXT,
ADD COLUMN     "hackerrankUrl" TEXT,
ADD COLUMN     "isSubscribed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "leetcodeUrl" TEXT,
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "phoneNo" TEXT,
ADD COLUMN     "rank" INTEGER,
ADD COLUMN     "totalCredit" INTEGER NOT NULL DEFAULT 50000,
ADD COLUMN     "userCredit" INTEGER NOT NULL DEFAULT 0;
