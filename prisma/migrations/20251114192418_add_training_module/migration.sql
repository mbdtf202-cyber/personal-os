-- CreateTable
CREATE TABLE "TrainingPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "domains" TEXT NOT NULL,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "weeks" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "targetHoursPerWeek" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TrainingPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TrainingSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "planId" TEXT,
    "date" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "durationMin" INTEGER,
    "domains" TEXT NOT NULL,
    "skillTags" TEXT NOT NULL,
    "description" TEXT,
    "projectId" TEXT,
    "blogPostId" TEXT,
    "aiInvolved" BOOLEAN NOT NULL DEFAULT false,
    "aiTools" TEXT NOT NULL,
    "aiNotes" TEXT,
    "outcomeScore" INTEGER,
    "notesMd" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TrainingSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TrainingSession_planId_fkey" FOREIGN KEY ("planId") REFERENCES "TrainingPlan" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TrainingSession_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TrainingSession_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "Post" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TrainingWeeklyReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "planId" TEXT,
    "weekIndex" INTEGER NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "summaryMd" TEXT NOT NULL,
    "lessonsMd" TEXT NOT NULL,
    "nextFocusMd" TEXT NOT NULL,
    "metricsJson" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TrainingWeeklyReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TrainingWeeklyReview_planId_fkey" FOREIGN KEY ("planId") REFERENCES "TrainingPlan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "TrainingPlan_userId_status_idx" ON "TrainingPlan"("userId", "status");

-- CreateIndex
CREATE INDEX "TrainingSession_userId_date_idx" ON "TrainingSession"("userId", "date");

-- CreateIndex
CREATE INDEX "TrainingSession_planId_idx" ON "TrainingSession"("planId");

-- CreateIndex
CREATE INDEX "TrainingSession_projectId_idx" ON "TrainingSession"("projectId");

-- CreateIndex
CREATE INDEX "TrainingSession_type_idx" ON "TrainingSession"("type");

-- CreateIndex
CREATE INDEX "TrainingWeeklyReview_userId_startDate_idx" ON "TrainingWeeklyReview"("userId", "startDate");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingWeeklyReview_planId_weekIndex_key" ON "TrainingWeeklyReview"("planId", "weekIndex");
