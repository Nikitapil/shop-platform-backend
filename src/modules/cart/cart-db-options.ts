import { getProductInclude } from '../products/products-db-options';

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
