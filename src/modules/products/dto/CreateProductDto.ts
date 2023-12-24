import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Product name', type: String })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Product description', type: String })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Product price', type: Number })
  @IsNumber()
  price: number;
}
