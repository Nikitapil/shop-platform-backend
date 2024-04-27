import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SetDeliveryPriceDto {
  @ApiProperty({ description: 'delivery price' })
  @IsNumber()
  deliveryPrice: number;
}
