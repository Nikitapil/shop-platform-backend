import { getProductInclude } from './products-options';

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
