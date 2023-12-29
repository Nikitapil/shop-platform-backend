import { ApiProperty } from '@nestjs/swagger';
import { ProductReturnDto } from './ProductReturnDto';

export class ProductInOrderReturnDto {
  @ApiProperty({ description: 'product in order id', type: String })
  id: string;

  @ApiProperty({ description: 'product in order product id', type: String })
  productId: string;

  @ApiProperty({ description: 'product in order order id', type: String })
  orderId: string;

  @ApiProperty({ description: 'product in cart count', type: Number })
  count: number;

  @ApiProperty({ description: 'product in cart product value', type: ProductReturnDto })
  product: ProductReturnDto;
}
