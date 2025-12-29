-- CreateTable
CREATE TABLE "dsa_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalSolved" INTEGER NOT NULL DEFAULT 0,
    "totalProblems" INTEGER NOT NULL DEFAULT 100,
    "easySolved" INTEGER NOT NULL DEFAULT 0,
    "easyTotal" INTEGER NOT NULL DEFAULT 24,
    "mediumSolved" INTEGER NOT NULL DEFAULT 0,
    "mediumTotal" INTEGER NOT NULL DEFAULT 64,
    "hardSolved" INTEGER NOT NULL DEFAULT 0,
    "hardTotal" INTEGER NOT NULL DEFAULT 12,
    "completionPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "lastSolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dsa_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dsa_problems_solved" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "solvedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dsa_problems_solved_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dsa_progress_userId_key" ON "dsa_progress"("userId");

-- CreateIndex
CREATE INDEX "dsa_progress_userId_idx" ON "dsa_progress"("userId");

-- CreateIndex
CREATE INDEX "dsa_problems_solved_userId_idx" ON "dsa_problems_solved"("userId");

-- CreateIndex
CREATE INDEX "dsa_problems_solved_problemId_idx" ON "dsa_problems_solved"("problemId");

-- CreateIndex
CREATE UNIQUE INDEX "dsa_problems_solved_userId_problemId_key" ON "dsa_problems_solved"("userId", "problemId");

-- CreateIndex
CREATE INDEX "User_clerkUserId_idx" ON "User"("clerkUserId");

-- AddForeignKey
ALTER TABLE "dsa_progress" ADD CONSTRAINT "dsa_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dsa_problems_solved" ADD CONSTRAINT "dsa_problems_solved_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
