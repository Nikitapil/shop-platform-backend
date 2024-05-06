import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { transformValueToNumber } from '../../../utils/dto-transformers';
import { SORTING_PARAMS, SortingEnum } from '../../../domain/common';

export class GetProductsQueryDto {
  @ApiProperty({ description: 'Page number', type: Number })
  @IsNumber()
  @Transform(transformValueToNumber)
  page: number;

  @ApiProperty({ description: 'Limit number', type: Number })
  @IsNumber()
  @Transform(transformValueToNumber)
  limit: number;

  @ApiPropertyOptional({
    description: 'products categoryId',
    type: String,
    nullable: true
  })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'price sorting direction',
    type: String,
    enum: SortingEnum,
    nullable: true
  })
  @IsString()
  @IsOptional()
  @IsEnum(SORTING_PARAMS)
  priceSorting?: 'asc' | 'desc';

  @ApiPropertyOptional({ description: 'search query', type: String, nullable: true })
  @IsString()
  @IsOptional()
  search?: string;
}
