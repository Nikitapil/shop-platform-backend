/*
  Warnings:

  - Added the required column `count` to the `ProductInOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductInOrder" ADD COLUMN     "count" INTEGER NOT NULL;
