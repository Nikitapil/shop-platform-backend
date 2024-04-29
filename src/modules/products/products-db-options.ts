import { Prisma } from '@prisma/client';

export const getProductInclude = (userId = ''): Prisma.ProductInclude => {
  return {
    category: true,
    favoritesProductsOnUser: {
      where: {
        userId
      }
    },
    reviews: {
      where: {
        userId
      }
    },
    discount: true
  };
};
