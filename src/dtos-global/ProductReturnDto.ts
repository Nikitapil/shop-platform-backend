import { CategoryReturnDto } from './CategoryReturnDto';
import { ApiProperty } from '@nestjs/swagger';

export class ProductReturnDto {
  @ApiProperty({ description: 'product id', type: String })
  id: string;

  @ApiProperty({ description: 'product name', type: String })
  name: string;

  @ApiProperty({ description: 'product description', type: String })
  description: string;

  @ApiProperty({ description: 'product imageUrl', type: String })
  imageUrl: string;

  @ApiProperty({ description: 'product price', type: Number })
  price: number;

  @ApiProperty({ description: 'product category id', type: String })
  categoryId: string;

  @ApiProperty({ description: 'product created at Date', type: String })
  createdAt: Date;

  @ApiProperty({ description: 'product updated at Date', type: String })
  updatedAt: Date;

  @ApiProperty({ description: 'product category', type: CategoryReturnDto })
  category: CategoryReturnDto;
}
