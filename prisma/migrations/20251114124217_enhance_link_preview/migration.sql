-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bookmark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "siteName" TEXT,
    "domain" TEXT,
    "faviconUrl" TEXT,
    "imageUrl" TEXT,
    "type" TEXT NOT NULL DEFAULT 'other',
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'TO_READ',
    "lastVisitedAt" DATETIME,
    "visitCount" INTEGER NOT NULL DEFAULT 0,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Bookmark" ("category", "createdAt", "description", "id", "isFavorite", "lastVisitedAt", "status", "title", "updatedAt", "url", "userId", "visitCount") SELECT "category", "createdAt", "description", "id", "isFavorite", "lastVisitedAt", "status", "title", "updatedAt", "url", "userId", "visitCount" FROM "Bookmark";
DROP TABLE "Bookmark";
ALTER TABLE "new_Bookmark" RENAME TO "Bookmark";
CREATE INDEX "Bookmark_userId_category_idx" ON "Bookmark"("userId", "category");
CREATE INDEX "Bookmark_status_isFavorite_idx" ON "Bookmark"("status", "isFavorite");
CREATE INDEX "Bookmark_userId_type_idx" ON "Bookmark"("userId", "type");
CREATE TABLE "new_NewsItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "summary" TEXT,
    "previewImage" TEXT,
    "siteName" TEXT,
    "domain" TEXT,
    "faviconUrl" TEXT,
    "type" TEXT NOT NULL DEFAULT 'article',
    "category" TEXT,
    "publishedAt" DATETIME NOT NULL,
    "fetchedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isFavorited" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "NewsItem_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "NewsSource" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_NewsItem" ("category", "fetchedAt", "id", "isFavorited", "isRead", "previewImage", "publishedAt", "sourceId", "summary", "title", "url") SELECT "category", "fetchedAt", "id", "isFavorited", "isRead", "previewImage", "publishedAt", "sourceId", "summary", "title", "url" FROM "NewsItem";
DROP TABLE "NewsItem";
ALTER TABLE "new_NewsItem" RENAME TO "NewsItem";
CREATE INDEX "NewsItem_sourceId_publishedAt_idx" ON "NewsItem"("sourceId", "publishedAt");
CREATE INDEX "NewsItem_isRead_isFavorited_idx" ON "NewsItem"("isRead", "isFavorited");
CREATE INDEX "NewsItem_type_idx" ON "NewsItem"("type");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
