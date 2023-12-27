import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ToggleFavoritesDto {
  @ApiProperty({ description: 'product id', type: String })
  @IsString()
  productId: string;
}
