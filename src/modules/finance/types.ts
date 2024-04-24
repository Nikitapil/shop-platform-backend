export interface IFinanceSettingsFromDb {
  tax: number;
  availableCurrencies: string[];
  updatedAt: Date;
  exchangeRates: Record<string, number>;
}
