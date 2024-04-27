export class EditFinanceSettingsDto {
  tax?: number;

  availableCurrencies?: string[];

  deliveryCost?: number;

  orderPriceWithFreeDelivery?: number;

  exchangeRates?: Record<string, number>;
}
