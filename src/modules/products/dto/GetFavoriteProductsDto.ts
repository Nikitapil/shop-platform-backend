import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { transformValueToNumber } from '../../../utils/dto-transformers';

export class GetFavoriteProductsDto {
  @ApiProperty({ description: 'Page number', type: Number })
  @IsNumber()
  @Transform(transformValueToNumber)
  page: number;

  @ApiProperty({ description: 'Limit number', type: Number })
  @IsNumber()
  @Transform(transformValueToNumber)
  limit: number;
}
