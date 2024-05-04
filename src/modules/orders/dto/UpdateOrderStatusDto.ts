import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { OrdersStatusesValues } from '../constants';

import { OrderStatusEnum } from './OrderStatusEnum';

export class UpdateOrderStatusDto {
  @ApiProperty({ description: 'Order id', type: String })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'New order status',
    type: String,
    enum: OrderStatusEnum,
    enumName: 'OrderStatusEnum'
  })
  @IsString()
  @IsEnum(OrdersStatusesValues)
  status: OrderStatusEnum;

  @ApiPropertyOptional({
    description: 'cancel reason if status is canceled',
    type: String,
    nullable: true
  })
  @IsString()
  @IsOptional()
  cancelReason?: string;
}
