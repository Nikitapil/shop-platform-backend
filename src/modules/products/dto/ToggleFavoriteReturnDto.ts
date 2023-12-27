import { ApiProperty } from '@nestjs/swagger';

export class ToggleFavoriteReturnDto {
  @ApiProperty({ description: 'Favorite product state', type: Boolean })
  isInFavorites: boolean;
}
