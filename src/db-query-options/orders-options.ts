import { getProductInclude } from './products-options';

export const getOrderInclude = (userId: string) => {
  return {
    productsInOrder: {
      include: {
        product: {
          include: getProductInclude(userId)
        }
      }
    }
  };
};
