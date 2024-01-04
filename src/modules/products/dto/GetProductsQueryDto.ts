import { ApiProperty } from '@nestjs/swagger';
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

  @ApiProperty({ description: 'products categoryId', type: String })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({
    description: 'price sorting direction',
    type: String,
    enum: ['asc', 'desc']
  })
  @IsString()
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  priceSorting?: 'asc' | 'desc';

  @ApiProperty({ description: 'search query', type: String })
  @IsString()
  @IsOptional()
  search?: string;
}
