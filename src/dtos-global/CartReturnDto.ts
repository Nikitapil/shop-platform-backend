import { ProductInCartReturnDto } from './ProductInCartReturnDto';
import { ApiProperty } from '@nestjs/swagger';
import { ICartFromDb } from '../modules/cart/types';
import { ProductReturnDto } from './ProductReturnDto';
import { getTaxSum } from '../utils/prices';

export class CartReturnDto {
  @ApiProperty({ description: 'cart id', type: String })
  id: string;

  @ApiProperty({ description: 'cart price', type: Number })
  price: number;

  @ApiProperty({ description: 'products in cart', type: [ProductInCartReturnDto] })
  productInCart: ProductInCartReturnDto[];

  @ApiProperty({ description: 'Sum of tax', type: Number })
  taxSum: number;

  constructor(cart: ICartFromDb, tax: number) {
    this.id = cart.id;
    this.productInCart = cart.productInCart.map((cartProduct) => ({
      ...cartProduct,
      product: new ProductReturnDto(cartProduct.product)
    }));
    this.price = this.productInCart.reduce(
      (acc, item) => acc + item.product.priceWithDiscount,
      0
    );
    this.taxSum = getTaxSum(this.price, tax);
  }
}
