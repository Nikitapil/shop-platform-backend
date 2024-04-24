import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class SetAvailableCurrenciesDto {
  @ApiProperty({ description: 'tax value', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  availableCurrencies: string[];
}
