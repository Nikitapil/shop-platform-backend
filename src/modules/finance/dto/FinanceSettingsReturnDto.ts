import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IFinanceSettingsFromDb } from '../types';

export class FinanceSettingsReturnDto {
  @ApiProperty({ description: 'Tax setting', type: Number })
  tax: number;

  @ApiProperty({ description: 'App available currencies', type: [String] })
  availableCurrencies: string[];

  @ApiProperty({
    description: 'exchange rates',
    additionalProperties: { type: 'number' }
  })
  exchangeRates: Record<string, number>;

  @ApiPropertyOptional({ description: 'All currencies that available to use' })
  allCurrencies?: string[];

  constructor(settingsFromDb: IFinanceSettingsFromDb) {
    this.tax = settingsFromDb.tax;
    this.availableCurrencies = settingsFromDb.availableCurrencies;
    this.allCurrencies = Object.keys(settingsFromDb.exchangeRates);

    this.exchangeRates = settingsFromDb.availableCurrencies.reduce((acc, currency) => {
      const rate = settingsFromDb.exchangeRates[currency];
      if (rate) {
        acc[currency] = rate;
      }
      return acc;
    }, {});
  }
}
