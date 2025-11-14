/*
  Warnings:

  - You are about to drop the `TrainingPlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrainingSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrainingWeeklyReview` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TrainingPlan";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TrainingSession";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TrainingWeeklyReview";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "TrainingNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "contentMd" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TrainingNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TrainingSnippet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TrainingSnippet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TrainingResource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TrainingResource_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TrainingBug" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "solution" TEXT,
    "tags" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "projectId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "solvedAt" DATETIME,
    CONSTRAINT "TrainingBug_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TrainingBug_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TrainingProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TrainingProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "TrainingNote_userId_domain_idx" ON "TrainingNote"("userId", "domain");

-- CreateIndex
CREATE INDEX "TrainingNote_isPinned_idx" ON "TrainingNote"("isPinned");

-- CreateIndex
CREATE INDEX "TrainingSnippet_userId_domain_idx" ON "TrainingSnippet"("userId", "domain");

-- CreateIndex
CREATE INDEX "TrainingSnippet_language_idx" ON "TrainingSnippet"("language");

-- CreateIndex
CREATE INDEX "TrainingResource_userId_domain_idx" ON "TrainingResource"("userId", "domain");

-- CreateIndex
CREATE INDEX "TrainingResource_type_idx" ON "TrainingResource"("type");

-- CreateIndex
CREATE INDEX "TrainingResource_isFavorite_idx" ON "TrainingResource"("isFavorite");

-- CreateIndex
CREATE INDEX "TrainingBug_userId_domain_idx" ON "TrainingBug"("userId", "domain");

-- CreateIndex
CREATE INDEX "TrainingBug_status_idx" ON "TrainingBug"("status");

-- CreateIndex
CREATE INDEX "TrainingBug_projectId_idx" ON "TrainingBug"("projectId");

-- CreateIndex
CREATE INDEX "TrainingProgress_userId_domain_idx" ON "TrainingProgress"("userId", "domain");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingProgress_userId_domain_skill_key" ON "TrainingProgress"("userId", "domain", "skill");
