import { ProductInCartReturnDto } from './ProductInCartReturnDto';
import { ApiProperty } from '@nestjs/swagger';
import { ICartFromDb } from '../modules/cart/types';
import { ProductReturnDto } from './ProductReturnDto';
import { getTaxSum } from '../utils/prices';
import { IFinanceSettingsFromDb } from '../modules/finance/types';

export class CartReturnDto {
  @ApiProperty({ description: 'cart id', type: String })
  id: string;

  @ApiProperty({ description: 'cart price', type: Number })
  price: number;

  @ApiProperty({ description: 'products in cart', type: [ProductInCartReturnDto] })
  productInCart: ProductInCartReturnDto[];

  @ApiProperty({ description: 'Sum of tax', type: Number })
  taxSum: number;

  constructor(cart: ICartFromDb, financeSettings: IFinanceSettingsFromDb) {
    this.id = cart.id;
    this.productInCart = cart.productInCart.map((cartProduct) => ({
      ...cartProduct,
      product: new ProductReturnDto(cartProduct.product)
    }));
    const totalProductPrice = this.productInCart.reduce(
      (acc, item) => acc + item.product.priceWithDiscount * item.count,
      0
    );
    const deliveryCost =
      totalProductPrice >= financeSettings.orderPriceWithFreeDelivery
        ? 0
        : financeSettings.deliveryCost;
    this.price = totalProductPrice + deliveryCost;
    this.taxSum = getTaxSum(this.price, financeSettings.tax);
  }
}
