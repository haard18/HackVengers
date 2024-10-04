/*
  Warnings:

  - Added the required column `iconurl` to the `Trainer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trainer" ADD COLUMN     "iconurl" TEXT NOT NULL;
