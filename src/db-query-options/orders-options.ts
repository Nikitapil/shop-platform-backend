import { getProductInclude } from './products-options';
import { safeUserSelect } from './user-options';

export const getOrderInclude = (userId: string) => {
  return {
    user: {
      select: safeUserSelect
    },
    productsInOrder: {
      include: {
        product: {
          include: getProductInclude(userId)
        }
      }
    }
  };
};
