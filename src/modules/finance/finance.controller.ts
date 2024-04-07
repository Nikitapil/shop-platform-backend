import { Controller, Get } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FinanceSettingsReturnDto } from './dto/FinanceSettingsReturnDto';

@Controller('finance')
export class FinanceController {
  constructor(private financeService: FinanceService) {}

  @ApiOperation({ summary: 'Get finance setting', operationId: 'getFinanceSettings' })
  @ApiResponse({ status: 200, type: FinanceSettingsReturnDto })
  @Get('/settings')
  getFinanceSettings(): Promise<FinanceSettingsReturnDto> {
    console.log('here')
    return this.financeService.getFinanceSettings();
  }
}
