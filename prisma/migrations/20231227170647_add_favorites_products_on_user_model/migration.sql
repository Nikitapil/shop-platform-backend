-- CreateTable
CREATE TABLE "FavoritesProductsOnUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "FavoritesProductsOnUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FavoritesProductsOnUser" ADD CONSTRAINT "FavoritesProductsOnUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoritesProductsOnUser" ADD CONSTRAINT "FavoritesProductsOnUser_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
