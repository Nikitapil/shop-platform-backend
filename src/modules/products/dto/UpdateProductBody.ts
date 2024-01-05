import { UpdateProductDto } from './UpdateProductDto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductBody extends UpdateProductDto {
  @ApiProperty({ description: 'product image', type: String, format: 'binary' })
  image: string;
}
