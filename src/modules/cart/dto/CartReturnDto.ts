import { ApiProperty } from '@nestjs/swagger';

import { getTaxSum } from '../../../utils/prices';

import { ICartFromDb } from '../types';
import { IFinanceSettingsFromDb } from '../../finance/types';

import { ProductInCartReturnDto } from './ProductInCartReturnDto';
import { ProductReturnDto } from '../../../dtos-global/ProductReturnDto';

export class CartReturnDto {
  @ApiProperty({ description: 'cart id', type: String })
  id: string;

  @ApiProperty({ description: 'cart price', type: Number })
  price: number;

  @ApiProperty({ description: 'products in cart', type: [ProductInCartReturnDto] })
  productInCart: ProductInCartReturnDto[];

  @ApiProperty({ description: 'Sum of tax', type: Number })
  taxSum: number;

  @ApiProperty({ description: 'Delivery cost', type: Number })
  deliveryCost: number;

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
      totalProductPrice >= financeSettings.orderPriceWithFreeDelivery ||
      !this.productInCart.length
        ? 0
        : financeSettings.deliveryCost;

    this.deliveryCost = deliveryCost;
    this.price = totalProductPrice + deliveryCost;
    this.taxSum = getTaxSum(this.price, financeSettings.tax);
  }
}
