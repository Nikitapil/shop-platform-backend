import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetFavoriteProductsDto {
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
}
