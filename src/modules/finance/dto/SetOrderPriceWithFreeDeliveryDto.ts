import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SetOrderPriceWithFreeDeliveryDto {
  @ApiProperty({ description: 'delivery price', type: Number })
  @IsNumber()
  orderPriceWithFreeDelivery: number;
}
