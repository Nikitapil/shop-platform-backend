import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @IsEnum(['CREATED', 'INPROGRESS', 'CANCELED', 'CLOSED'])
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
