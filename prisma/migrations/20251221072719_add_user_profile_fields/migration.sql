/*
  Warnings:

  - You are about to drop the column `githuburl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `linkedinurl` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "githuburl",
DROP COLUMN "linkedinurl";
