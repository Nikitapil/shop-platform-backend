import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateDiscountDto {
  @ApiProperty({ description: 'discount name', type: String })
  @IsString()
  name: string;

  @ApiProperty({ description: 'discount name', type: Number })
  @IsNumber()
  percentage: number;
}
