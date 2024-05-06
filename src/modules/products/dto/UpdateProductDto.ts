import { ApiProperty } from '@nestjs/swagger';

import { IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { transformValueToNumber } from '../../../utils/dto-transformers';

export class UpdateProductDto {
  @ApiProperty({ description: 'Product id', type: String })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Product name', type: String })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Product description', type: String })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Product category id', type: String })
  @IsString()
  categoryId: string;

  @ApiProperty({ description: 'Product price', type: Number })
  @IsNumber()
  @Transform(transformValueToNumber)
  price: number;
}
