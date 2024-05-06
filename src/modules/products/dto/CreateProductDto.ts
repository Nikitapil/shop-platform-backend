import { IsNumber, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { transformValueToNumber } from '../../../utils/dto-transformers';

export class CreateProductDto {
  @ApiProperty({ description: 'Product name', type: String })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ description: 'Product description', type: String })
  @IsString()
  @MinLength(1)
  description: string;

  @ApiProperty({ description: 'Product category id', type: String })
  @IsString()
  @MinLength(1)
  categoryId: string;

  @ApiProperty({ description: 'Product price', type: Number })
  @IsNumber()
  @Transform(transformValueToNumber)
  price: number;
}
