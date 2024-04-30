import { ApiProperty } from '@nestjs/swagger';

import { ProductReturnDto } from '../../products/dto/ProductReturnDto';

export class ProductInCartReturnDto {
  @ApiProperty({ description: 'product in cart id', type: String })
  id: string;

  @ApiProperty({ description: 'product in cart product id', type: String })
  productId: string;

  @ApiProperty({ description: 'product in cart cart id', type: String })
  cartId: string;

  @ApiProperty({ description: 'product in cart count', type: Number })
  count: number;

  @ApiProperty({ description: 'product in cart product value', type: ProductReturnDto })
  product: ProductReturnDto;
}
