import { getProductInclude } from '../../db-query-options/products-options';

export const getCartInclude = (userId: string) => {
  return {
    productInCart: {
      include: {
        product: {
          include: getProductInclude(userId)
        }
      }
    }
  };
};
