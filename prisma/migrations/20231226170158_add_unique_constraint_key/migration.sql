/*
  Warnings:

  - A unique constraint covering the columns `[productId,cartId]` on the table `ProductInCart` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProductInCart_productId_cartId_key" ON "ProductInCart"("productId", "cartId");
