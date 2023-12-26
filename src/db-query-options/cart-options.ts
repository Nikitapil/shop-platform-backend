import { Prisma } from '@prisma/client';

export const cartInclude: Prisma.CartInclude = {
  productInCart: {
    include: {
      product: true
    }
  }
};
