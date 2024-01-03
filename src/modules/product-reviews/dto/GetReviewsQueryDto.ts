import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetReviewsQueryDto {
  @ApiProperty({ description: 'Page number', type: Number })
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  page: number;

  @ApiProperty({ description: 'Limit number', type: Number })
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  limit: number;

  @ApiProperty({ description: 'product id', type: String })
  @IsString()
  @IsNotEmpty()
  productId: string;
}
