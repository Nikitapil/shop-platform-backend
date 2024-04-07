import { Body, Controller, Get, Put } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FinanceSettingsReturnDto } from './dto/FinanceSettingsReturnDto';
import { SetTaxDto } from './dto/SetTaxDto';

@Controller('finance')
export class FinanceController {
  constructor(private financeService: FinanceService) {}

  @ApiOperation({ summary: 'Get finance setting', operationId: 'getFinanceSettings' })
  @ApiResponse({ status: 200, type: FinanceSettingsReturnDto })
  @Get('/settings')
  getFinanceSettings(): Promise<FinanceSettingsReturnDto> {
    return this.financeService.getFinanceSettings();
  }

  @ApiOperation({ summary: 'Set new tax value', operationId: 'setTaxValue' })
  @ApiResponse({ status: 200, type: FinanceSettingsReturnDto })
  @Put('/settings/tax')
  setTax(@Body() dto: SetTaxDto) {
    return this.financeService.setTax(dto);
  }
}
