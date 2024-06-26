import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IFinanceSettingsFromDb } from '../types';
import { EUserRoles, IUserFromToken } from '../../../domain/users.domain';

export class FinanceSettingsReturnDto {
  @ApiProperty({ description: 'Tax setting', type: Number })
  tax: number;

  @ApiProperty({ description: 'Delivery cost', type: Number })
  deliveryCost: number;

  @ApiProperty({ description: 'Order price with free delivery', type: Number })
  orderPriceWithFreeDelivery: number;

  @ApiProperty({ description: 'App available currencies', type: [String] })
  availableCurrencies: string[];

  @ApiProperty({
    description: 'exchange rates',
    additionalProperties: { type: 'number' }
  })
  exchangeRates: Record<string, number>;

  @ApiPropertyOptional({ description: 'All currencies that available to use' })
  allCurrencies?: string[];

  constructor(settingsFromDb: IFinanceSettingsFromDb, user?: IUserFromToken) {
    this.tax = settingsFromDb.tax;
    this.deliveryCost = settingsFromDb.deliveryCost;
    this.orderPriceWithFreeDelivery = settingsFromDb.orderPriceWithFreeDelivery;
    this.availableCurrencies = settingsFromDb.availableCurrencies;
    if (user?.roles?.includes(EUserRoles.ADMIN)) {
      this.allCurrencies = Object.keys(settingsFromDb.exchangeRates);
    }

    this.exchangeRates = settingsFromDb.availableCurrencies.reduce((acc, currency) => {
      const rate = settingsFromDb.exchangeRates[currency];
      if (rate) {
        acc[currency] = rate;
      }
      return acc;
    }, {});
  }
}
