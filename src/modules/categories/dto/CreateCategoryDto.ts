import { ApiProperty } from '@nestjs/swagger';

import { IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category name', type: String })
  @IsString()
  @MinLength(3)
  name: string;
}
