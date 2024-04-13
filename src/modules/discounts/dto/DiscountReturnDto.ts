import { ApiProperty } from '@nestjs/swagger';
import { ProductReturnDto } from '../../../dtos-global/ProductReturnDto';
import { IDiscountFromDb } from '../types';
import { EUserRoles, IUserFromToken } from '../../../domain/users';

export class DiscountReturnDto {
  @ApiProperty({ description: 'discount id', type: String })
  id: string;

  @ApiProperty({ description: 'discount name', type: String })
  name: string;

  @ApiProperty({ description: 'discount name', type: String })
  percentage: number;

  @ApiProperty({ description: 'products', type: [ProductReturnDto] })
  products: ProductReturnDto[];

  @ApiProperty({ description: 'products count', type: Number })
  productsCount: number;

  @ApiProperty({ description: 'can delete discount', type: Boolean })
  canDelete: boolean;

  constructor(discount: IDiscountFromDb, user?: IUserFromToken) {
    this.id = discount.id;
    this.name = discount.name;
    this.percentage = discount.percentage;
    this.products = discount.products.map((product) => new ProductReturnDto(product));
    this.productsCount = discount._count.products;
    this.canDelete = !!user?.roles?.includes(EUserRoles.ADMIN);
  }
}
