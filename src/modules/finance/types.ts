export interface IFinanceSettingsFromDb {
  tax: number;
  deliveryCost: number;
  orderPriceWithFreeDelivery: number;
  availableCurrencies: string[];
  updatedAt: Date;
  exchangeRates: Record<string, number>;
}
