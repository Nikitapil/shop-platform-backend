import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveFromCartDto {
  @ApiProperty({
    description: 'id of product that will be removed from cart',
    type: String
  })
  @IsString()
  productInCartId: string;
}
