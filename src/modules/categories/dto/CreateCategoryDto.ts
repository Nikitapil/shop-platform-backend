import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category name', type: String })
  @IsString()
  @MinLength(3)
  name: string;
}
