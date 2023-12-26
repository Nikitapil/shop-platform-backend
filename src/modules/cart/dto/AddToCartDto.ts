import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ description: 'id of product that will be added to cart', type: String })
  @IsString()
  productId: string;
}
