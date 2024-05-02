import { ApiProperty } from '@nestjs/swagger';

import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class SetAvailableCurrenciesDto {
  @ApiProperty({ description: 'Available currencies array', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  availableCurrencies: string[];
}
