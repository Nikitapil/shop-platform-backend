import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetProductsQueryDto {
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
    enum: ['asc', 'desc'],
    nullable: true
  })
  @IsString()
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  priceSorting?: 'asc' | 'desc';

  @ApiPropertyOptional({ description: 'search query', type: String, nullable: true })
  @IsString()
  @IsOptional()
  search?: string;
}
