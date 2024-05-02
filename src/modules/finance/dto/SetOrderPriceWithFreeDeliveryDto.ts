import { ApiProperty } from '@nestjs/swagger';

import { IsNumber } from 'class-validator';

export class SetOrderPriceWithFreeDeliveryDto {
  @ApiProperty({ description: 'order price with free delivery', type: Number })
  @IsNumber()
  orderPriceWithFreeDelivery: number;
}
