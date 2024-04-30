import { ProductReturnDto } from '../../../dtos-global/ProductReturnDto';
import { ApiProperty } from '@nestjs/swagger';

export class GetProductsReturnDto {
  @ApiProperty({ description: 'products list', type: [ProductReturnDto] })
  products: ProductReturnDto[];

  @ApiProperty({
    description: 'total count of products with current filter',
    type: Number
  })
  totalCount: number;
}
