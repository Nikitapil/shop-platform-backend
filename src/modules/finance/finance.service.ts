import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FINANCE_SETTINGS_ID } from './constants';

@Injectable()
export class FinanceService {
  constructor(private prismaService: PrismaService) {}

  async getFinanceSettings() {
    try {
      let settings = await this.prismaService.financeSettings.findUnique({
        where: { id: FINANCE_SETTINGS_ID },
        select: {
          tax: true
        }
      });
      console.log('settings', settings);
      if (!settings) {
        settings = await this.prismaService.financeSettings.create({
          select: {
            tax: true
          }
        });
      }
      return settings;
    } catch (e) {
      throw new BadRequestException(e.message || 'Error getting finance settings');
    }
  }
}
