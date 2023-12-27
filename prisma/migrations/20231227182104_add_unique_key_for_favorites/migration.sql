/*
  Warnings:

  - A unique constraint covering the columns `[userId,productId]` on the table `FavoritesProductsOnUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FavoritesProductsOnUser_userId_productId_key" ON "FavoritesProductsOnUser"("userId", "productId");
