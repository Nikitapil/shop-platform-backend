import { ApiProperty } from '@nestjs/swagger';

import { UpdateProductDto } from './UpdateProductDto';

export class UpdateProductBody extends UpdateProductDto {
  @ApiProperty({ description: 'product image', type: String, format: 'binary' })
  image: string;
}
