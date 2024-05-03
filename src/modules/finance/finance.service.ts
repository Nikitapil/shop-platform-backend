import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';

import {
  DEFAULT_EXCHANGE_RATES,
  FINANCE_SETTINGS_ID,
  UPDATE_EXCHANGE_RATES_IN_HOURS
} from './constants';

import { financeSelectSettings } from './finance-db-options';

import { getDiffInHours } from '../../utils/dates';
import { catchError } from '../../utils/errors';

import { IUserFromToken } from '../../domain/users.domain';
import {
  IEditFinanceSettingsParams,
  ISetAvailableCurrenciesParams,
  ISetDeliveryCostParams,
  ISetOrderPriceWithFreeDeliveryParams,
  ISetTaxParams
} from './types';

import { FinanceSettingsReturnDto } from './dto/FinanceSettingsReturnDto';

@Injectable()
export class FinanceService {
  constructor(
    private prismaService: PrismaService,
    private readonly httpService: HttpService
  ) {}

  private async getExchangeRates() {
    try {
      const {
        data: { rates }
      } = await this.httpService.axiosRef.get('https://open.er-api.com/v6/latest/USD');
      return rates;
    } catch (e) {
      return DEFAULT_EXCHANGE_RATES;
    }
  }

  private async editFinanceSettings({ dto, user }: IEditFinanceSettingsParams) {
    const settings = await this.prismaService.financeSettings.update({
      where: { id: FINANCE_SETTINGS_ID },
      data: dto,
      select: financeSelectSettings
    });
    if (!settings) {
      throw new NotFoundException('Settings not found.');
    }
    return new FinanceSettingsReturnDto(settings, user);
  }

  async getFinanceSettings(user?: IUserFromToken) {
    try {
      let settings = await this.prismaService.financeSettings.findUnique({
        where: { id: FINANCE_SETTINGS_ID },
        select: financeSelectSettings
      });

      if (!settings) {
        const rates = await this.getExchangeRates();
        settings = await this.prismaService.financeSettings.create({
          data: {
            exchangeRates: rates
          },
          select: financeSelectSettings
        });
      }

      if (
        !settings.exchangeRates ||
        getDiffInHours(new Date(), settings.updatedAt) >= UPDATE_EXCHANGE_RATES_IN_HOURS
      ) {
        return await this.updateExchangeRates(user);
      }

      return new FinanceSettingsReturnDto(settings, user);
    } catch (e: any) {
      catchError(e, 'Error getting finance settings');
    }
  }

  async setTax({ dto, user }: ISetTaxParams) {
    try {
      return await this.editFinanceSettings({ dto, user });
    } catch (e: any) {
      catchError(e, 'Error while updating tax');
    }
  }

  async setAvailableCurrencies({ dto, user }: ISetAvailableCurrenciesParams) {
    try {
      const financeSetting = await this.getFinanceSettings(user);

      if (!financeSetting) {
        throw new NotFoundException('Settings not found.');
      }

      const invalidCurrency = dto.availableCurrencies.find(
        (curr) => !financeSetting.allCurrencies?.includes(curr)
      );

      if (invalidCurrency !== undefined) {
        throw new NotAcceptableException(
          `Currencies include invalid currency: ${invalidCurrency}`
        );
      }

      return await this.editFinanceSettings({ dto, user });
    } catch (e: any) {
      catchError(e, 'Error while updating available currencies');
    }
  }

  async updateExchangeRates(user?: IUserFromToken) {
    try {
      const rates = await this.getExchangeRates();
      return this.editFinanceSettings({
        dto: {
          exchangeRates: rates
        },
        user
      });
    } catch (e: any) {
      catchError(e, 'Error while updating exchange rates');
    }
  }

  async setDeliveryCost({ dto, user }: ISetDeliveryCostParams) {
    try {
      return await this.editFinanceSettings({ dto, user });
    } catch (e: any) {
      catchError(e, 'Error while updating delivery cost');
    }
  }

  async setOrderPriceWithFreeDelivery({
    dto,
    user
  }: ISetOrderPriceWithFreeDeliveryParams) {
    try {
      return await this.editFinanceSettings({ dto, user });
    } catch (e: any) {
      catchError(e, 'Error while updating order price with free delivery');
    }
  }
}
