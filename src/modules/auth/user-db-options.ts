import { Prisma } from '@prisma/client';

export const safeUserSelect: Prisma.UserSelect = {
  id: true,
  email: true,
  name: true,
  roles: true,
  cartId: true,
  address: true,
  phone: true
};
