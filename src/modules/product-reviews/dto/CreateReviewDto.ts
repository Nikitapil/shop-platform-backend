import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'product id', type: String })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'review text', type: String })
  @IsString()
  text: string;

  @ApiProperty({ description: 'review rating', type: Number })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}
