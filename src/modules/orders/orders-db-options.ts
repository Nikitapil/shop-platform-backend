import { getProductInclude } from '../products/products-db-options';
import { safeUserSelect } from '../auth/user-db-options';

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
