import { ApiProperty } from '@nestjs/swagger';
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

  @IsEnum(['updatedAt', 'createdAt'])
  @IsString()
  @IsOptional()
  order?: 'createdAt' | 'updatedAt';

  @IsString()
  @IsEnum(['CREATED', 'INPROGRESS', 'CANCELED', 'CLOSED'])
  @IsOptional()
  status?: EOrderStatuses;
}
