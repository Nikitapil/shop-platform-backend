/*
  Warnings:

  - A unique constraint covering the columns `[cartId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cartId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cartId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductInCart" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,

    CONSTRAINT "ProductInCart_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_cartId_key" ON "User"("cartId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInCart" ADD CONSTRAINT "ProductInCart_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInCart" ADD CONSTRAINT "ProductInCart_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;
