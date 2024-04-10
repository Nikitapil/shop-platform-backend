import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class EditDiscountDto {
  @ApiProperty({ description: 'discount name', type: String })
  @IsString()
  id: string;

  @ApiProperty({ description: 'discount name', type: String })
  @IsString()
  name: string;

  @ApiProperty({ description: 'discount name', type: String })
  @IsNumber()
  percentage: number;
}
