export const getTaxSum = (price: number, tax: number) => price * (tax / 100);

export const getPriceWithDiscount = (price: number, discountPercent: number) =>
  price - price * (discountPercent / 100);
