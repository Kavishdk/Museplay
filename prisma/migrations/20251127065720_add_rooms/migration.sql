/*
  Warnings:

  - Added the required column `roomId` to the `Stream` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorId" TEXT NOT NULL,
    CONSTRAINT "Room_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Stream" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "extractedId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "thumbnailSml" TEXT NOT NULL DEFAULT '',
    "thumbnaidBig" TEXT NOT NULL DEFAULT '',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    CONSTRAINT "Stream_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Stream_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Stream" ("active", "extractedId", "id", "thumbnaidBig", "thumbnailSml", "title", "type", "url", "userId") SELECT "active", "extractedId", "id", "thumbnaidBig", "thumbnailSml", "title", "type", "url", "userId" FROM "Stream";
DROP TABLE "Stream";
ALTER TABLE "new_Stream" RENAME TO "Stream";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
