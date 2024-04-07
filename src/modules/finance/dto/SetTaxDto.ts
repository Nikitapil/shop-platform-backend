import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SetTaxDto {
  @ApiProperty({ description: 'tax value', type: Number })
  @IsNumber()
  tax: number;
}
