/*
  Warnings:

  - You are about to drop the column `codeforcesUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `hackerrankUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `leetcodeUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `linkedinUrl` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "codeforcesUrl",
DROP COLUMN "hackerrankUrl",
DROP COLUMN "leetcodeUrl",
DROP COLUMN "linkedinUrl",
ADD COLUMN     "githuburl" TEXT,
ADD COLUMN     "linkedinurl" TEXT;
