import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SetDeliveryCostDto {
  @ApiProperty({ description: 'delivery cost', type: Number })
  @IsNumber()
  deliveryCost: number;
}
