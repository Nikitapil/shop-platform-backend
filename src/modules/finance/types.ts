export interface IFinanceSettingsFromDb {
  tax: number;
  deliveryCost: number;
  availableCurrencies: string[];
  updatedAt: Date;
  exchangeRates: Record<string, number>;
}
