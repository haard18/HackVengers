/*
  Warnings:

  - Added the required column `sessionId` to the `Ratings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ratings" ADD COLUMN     "sessionId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Ratings" ADD CONSTRAINT "Ratings_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
