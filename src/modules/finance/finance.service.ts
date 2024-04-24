import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FINANCE_SETTINGS_ID } from './constants';
import { SetTaxDto } from './dto/SetTaxDto';
import { financeSelectSettings } from './db-options/FinanceSelectSettings';

@Injectable()
export class FinanceService {
  constructor(private prismaService: PrismaService) {}

  async getFinanceSettings() {
    try {
      let settings = await this.prismaService.financeSettings.findUnique({
        where: { id: FINANCE_SETTINGS_ID },
        select: financeSelectSettings
      });

      if (!settings) {
        settings = await this.prismaService.financeSettings.create({
          select: financeSelectSettings
        });
      }

      return settings;
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
