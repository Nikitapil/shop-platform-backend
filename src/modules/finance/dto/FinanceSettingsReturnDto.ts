import { ApiProperty } from '@nestjs/swagger';

export class FinanceSettingsReturnDto {
  @ApiProperty({ description: 'Tax setting', type: Number })
  tax: number;
}
