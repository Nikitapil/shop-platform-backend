import { ApiProperty } from '@nestjs/swagger';

import { IsString, MinLength } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({ description: 'Category name', type: String })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ description: 'Category id', type: String })
  @IsString()
  id: string;
}
