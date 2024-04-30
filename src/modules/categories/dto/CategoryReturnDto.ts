import { ApiProperty } from '@nestjs/swagger';

export class CategoryReturnDto {
  @ApiProperty({ description: 'category id', type: String })
  id: string;

  @ApiProperty({ description: 'category name', type: String })
  name: string;

  @ApiProperty({ description: 'category created at date', type: Date })
  createdAt: Date;

  @ApiProperty({ description: 'category updated at date', type: Date })
  updatedAt: Date;
}
