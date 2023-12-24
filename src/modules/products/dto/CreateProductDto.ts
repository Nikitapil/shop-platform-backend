import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateProductDto {
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
  @Transform(({ value }) => {
    return Number(value);
  })
  price: number;
}
