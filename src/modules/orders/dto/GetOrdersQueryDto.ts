import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { EOrderStatuses } from '../../../domain/orders';

export class GetOrdersQueryDto {
  @ApiProperty({ description: 'Page number', type: Number })
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  page: number;

  @ApiProperty({ description: 'Limit number', type: Number })
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  limit: number;

  @ApiPropertyOptional({
    description: 'orders by param',
    type: String,
    enum: ['updatedAt', 'createdAt'],
    nullable: true
  })
  @IsEnum(['updatedAt', 'createdAt'])
  @IsString()
  @IsOptional()
  order?: 'createdAt' | 'updatedAt';

  @ApiPropertyOptional({
    description: 'orders status',
    type: String,
    enum: ['CREATED', 'INPROGRESS', 'CANCELED', 'CLOSED'],
    nullable: true
  })
  @IsString()
  @IsEnum(['CREATED', 'INPROGRESS', 'CANCELED', 'CLOSED'])
  @IsOptional()
  status?: EOrderStatuses;
}
