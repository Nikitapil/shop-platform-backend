export const cartInclude = {
  productInCart: {
    include: {
      product: {
        include: {
          category: true
        }
      }
    }
  }
} as const;
