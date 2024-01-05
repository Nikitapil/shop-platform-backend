import { CreateProductDto } from './CreateProductDto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductBody extends CreateProductDto {
  @ApiProperty({ description: 'product image', type: String, format: 'binary' })
  image: string;
}
