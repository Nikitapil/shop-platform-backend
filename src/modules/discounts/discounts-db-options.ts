import { getProductInclude } from '../products/products-db-options';

export const getDiscountsInclude = (userId?: string) => {
  return {
    products: {
      include: getProductInclude(userId)
    },
    _count: {
      select: {
        products: true
      }
    }
  };
};
