import { ApiProperty } from '@nestjs/swagger';
import { ProductReturnDto } from '../../../dtos-global/ProductReturnDto';
import { IDiscountFromDb } from '../types';

export class DiscountReturnDto {
  @ApiProperty({ description: 'discount id', type: String })
  id: string;

  @ApiProperty({ description: 'discount name', type: String })
  name: string;

  @ApiProperty({ description: 'discount name', type: String })
  percentage: number;

  @ApiProperty({ description: 'products', type: [ProductReturnDto] })
  products: ProductReturnDto[];

  constructor(discount: IDiscountFromDb) {
    this.id = discount.id;
    this.name = discount.name;
    this.percentage = discount.percentage;
    this.products = discount.products.map((product) => new ProductReturnDto(product));
  }
}
