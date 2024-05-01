import { ApiProperty } from '@nestjs/swagger';

import { IsString } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ description: 'id of product that will be added to cart', type: String })
  @IsString()
  productId: string;
}
