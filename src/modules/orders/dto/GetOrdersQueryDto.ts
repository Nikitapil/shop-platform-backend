import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { Transform } from 'class-transformer';
import { transformValueToNumber } from '../../../utils/dto-transformers';

import { OrderStatusEnum } from './OrderStatusEnum';
import { GetOrdersOrderParamValues, OrdersStatusesValues } from '../constants';

export class GetOrdersQueryDto {
  @ApiProperty({ description: 'Page number', type: Number })
  @IsNumber()
  @Transform(transformValueToNumber)
  page: number;

  @ApiProperty({ description: 'Limit number', type: Number })
  @IsNumber()
  @Transform(transformValueToNumber)
  limit: number;

  @ApiPropertyOptional({
    description: 'orders by param',
    type: String,
    enum: GetOrdersOrderParamValues,
    nullable: true
  })
  @IsEnum(GetOrdersOrderParamValues)
  @IsString()
  @IsOptional()
  order?: 'createdAt' | 'updatedAt';

  @ApiPropertyOptional({
    description: 'orders status',
    type: String,
    enum: OrderStatusEnum,
    enumName: 'OrderStatusEnum',
    nullable: true
  })
  @IsString()
  @IsEnum(OrdersStatusesValues)
  @IsOptional()
  status?: OrderStatusEnum;
}
