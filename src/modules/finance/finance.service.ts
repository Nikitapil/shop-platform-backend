import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FINANCE_SETTINGS_ID } from './constants';
import { SetTaxDto } from './dto/SetTaxDto';
import { financeSelectSettings } from './db-options/FinanceSelectSettings';
import { HttpService } from '@nestjs/axios';
import { getDiffInHours } from '../../utils/dates';
import {FinanceSettingsReturnDto} from "./dto/FinanceSettingsReturnDto";

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

  async getFinanceSettings() {
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
        const rates = await this.getExchangeRates();

        settings = await this.prismaService.financeSettings.update({
          where: { id: FINANCE_SETTINGS_ID },
          data: {
            exchangeRates: rates
          },
          select: financeSelectSettings
        });
      }

      return new FinanceSettingsReturnDto(settings);
    } catch (e: any) {
      throw new BadRequestException(e.message || 'Error getting finance settings');
    }
  }

  async setTax(dto: SetTaxDto) {
    try {
      const settings = await this.prismaService.financeSettings.update({
        where: { id: FINANCE_SETTINGS_ID },
        data: dto,
        select: financeSelectSettings
      });
      if (!settings) {
        throw new NotFoundException('Settings not found.');
      }
      return settings;
    } catch (e: any) {
      throw new BadRequestException(e.message || 'Error while updating tax');
    }
  }
}
