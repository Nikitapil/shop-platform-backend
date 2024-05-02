import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FINANCE_SETTINGS_ID } from './constants';
import { SetTaxDto } from './dto/SetTaxDto';
import { financeSelectSettings } from './finance-db-options';
import { HttpService } from '@nestjs/axios';
import { getDiffInHours } from '../../utils/dates';
import { FinanceSettingsReturnDto } from './dto/FinanceSettingsReturnDto';
import { IUserFromToken } from '../../domain/users.domain';
import { SetAvailableCurrenciesDto } from './dto/SetAvailableCurrenciesDto';
import { catchError } from '../../utils/errors';
import { SetDeliveryCostDto } from './dto/SetDeliveryCostDto';
import { EditFinanceSettingsDto } from './dto/EditFinanceSettingsDto';
import { SetOrderPriceWithFreeDeliveryDto } from './dto/SetOrderPriceWithFreeDeliveryDto';

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
      return {
        USD: 1
      };
    }
  }

  private async editFinanceSettings(dto: EditFinanceSettingsDto, user?: IUserFromToken) {
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
        getDiffInHours(new Date(), settings.updatedAt) >= 24
      ) {
        return await this.updateExchangeRates(user);
      }

      return new FinanceSettingsReturnDto(settings, user);
    } catch (e: any) {
      catchError(e, 'Error getting finance settings');
    }
  }

  async setTax(dto: SetTaxDto, user?: IUserFromToken) {
    try {
      return await this.editFinanceSettings(dto, user);
    } catch (e: any) {
      catchError(e, 'Error while updating tax');
    }
  }

  async setAvailableCurrencies(dto: SetAvailableCurrenciesDto, user?: IUserFromToken) {
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

      return await this.editFinanceSettings(dto, user);
    } catch (e: any) {
      catchError(e, 'Error while updating available currencies');
    }
  }

  async updateExchangeRates(user?: IUserFromToken) {
    try {
      const rates = await this.getExchangeRates();
      return this.editFinanceSettings({ exchangeRates: rates }, user);
    } catch (e: any) {
      catchError(e, 'Error while updating exchange rates');
    }
  }

  async setDeliveryCost(dto: SetDeliveryCostDto, user?: IUserFromToken) {
    try {
      return await this.editFinanceSettings(dto, user);
    } catch (e: any) {
      catchError(e, 'Error while updating delivery cost');
    }
  }

  async setOrderPriceWithFreeDelivery(
    dto: SetOrderPriceWithFreeDeliveryDto,
    user?: IUserFromToken
  ) {
    try {
      return await this.editFinanceSettings(dto, user);
    } catch (e: any) {
      catchError(e, 'Error while updating order price with free delivery');
    }
  }
}
