import { EOrderStatuses } from '../../../domain/orders';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderStatusDto {
  @ApiProperty({ description: 'Order id', type: String })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'New order status',
    type: String,
    enum: ['CREATED', 'INPROGRESS', 'CANCELED', 'CLOSED']
  })
  @IsString()
  @IsEnum(['CREATED', 'INPROGRESS', 'CANCELED', 'CLOSED'])
  status: EOrderStatuses;

  @ApiProperty({
    description: 'cance reason if status is canceled',
    type: String,
    nullable: true
  })
  @IsString()
  @IsOptional()
  cancelReason?: string;
}
