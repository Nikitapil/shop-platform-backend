import { ProductInCartReturnDto } from './ProductInCartReturnDto';
import { ApiProperty } from '@nestjs/swagger';

export class CartReturnDto {
  @ApiProperty({ description: 'cart id', type: String })
  id: string;

  @ApiProperty({ description: 'cart price', type: Number })
  price: number;

  @ApiProperty({ description: 'products in cart', type: [ProductInCartReturnDto] })
  productInCart: ProductInCartReturnDto[];
}
