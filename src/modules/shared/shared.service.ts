import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FINANCE_SETTINGS_ID } from '../finance/constants';

@Injectable()
export class SharedService {
  constructor(private readonly prismaService: PrismaService) {}

  getFinanceSettings() {
    return this.prismaService.financeSettings.findUnique({
      where: { id: FINANCE_SETTINGS_ID }
    });
  }
}
