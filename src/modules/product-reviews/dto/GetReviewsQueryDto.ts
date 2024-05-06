import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { Transform } from 'class-transformer';

import { transformValueToNumber } from '../../../utils/dto-transformers';

export class GetReviewsQueryDto {
  @ApiProperty({ description: 'Page number', type: Number })
  @IsNumber()
  @Transform(transformValueToNumber)
  page: number;

  @ApiProperty({ description: 'Limit number', type: Number })
  @IsNumber()
  @Transform(transformValueToNumber)
  limit: number;

  @ApiProperty({ description: 'product id', type: String })
  @IsString()
  @IsNotEmpty()
  productId: string;
}
