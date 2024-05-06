import { ApiProperty } from '@nestjs/swagger';

import { IsString } from 'class-validator';

export class ToggleFavoritesDto {
  @ApiProperty({ description: 'product id', type: String })
  @IsString()
  productId: string;
}
