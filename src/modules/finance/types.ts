import { IUserParam } from '../../domain/users.domain';
import { EditFinanceSettingsDto } from './dto/EditFinanceSettingsDto';
import { SetTaxDto } from './dto/SetTaxDto';
import { SetAvailableCurrenciesDto } from './dto/SetAvailableCurrenciesDto';
import { SetDeliveryCostDto } from './dto/SetDeliveryCostDto';
import { SetOrderPriceWithFreeDeliveryDto } from './dto/SetOrderPriceWithFreeDeliveryDto';

export interface IFinanceSettingsFromDb {
  tax: number;
  deliveryCost: number;
  orderPriceWithFreeDelivery: number;
  availableCurrencies: string[];
  updatedAt: Date;
  exchangeRates: Record<string, number>;
}

export interface IEditFinanceSettingsParams extends IUserParam {
  dto: EditFinanceSettingsDto;
}

export interface ISetTaxParams extends IUserParam {
  dto: SetTaxDto;
}

export interface ISetAvailableCurrenciesParams extends IUserParam {
  dto: SetAvailableCurrenciesDto;
}

export interface ISetDeliveryCostParams extends IUserParam {
  dto: SetDeliveryCostDto;
}

export interface ISetOrderPriceWithFreeDeliveryParams extends IUserParam {
  dto: SetOrderPriceWithFreeDeliveryDto;
}
