import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FinanceSettingsReturnDto } from './dto/FinanceSettingsReturnDto';
import { SetTaxDto } from './dto/SetTaxDto';
import { Roles } from '../../decorators/Roles.decorator';
import {EUserRoles, IUserFromToken} from '../../domain/users';
import { ApplyUserGuard } from '../../guards/users/apply-user.guard';
import {User} from "../../decorators/User.decorator";

@Controller('finance')
export class FinanceController {
  constructor(private financeService: FinanceService) {}

  @ApiOperation({ summary: 'Get finance setting', operationId: 'getFinanceSettings' })
  @ApiResponse({ status: 200, type: FinanceSettingsReturnDto })
  @UseGuards(ApplyUserGuard)
  @Get('/settings')
  getFinanceSettings(@User() user: IUserFromToken): Promise<FinanceSettingsReturnDto> {
    return this.financeService.getFinanceSettings(user);
  }

  @ApiOperation({ summary: 'Set new tax value', operationId: 'setTaxValue' })
  @ApiResponse({ status: 200, type: FinanceSettingsReturnDto })
  @Roles([EUserRoles.ADMIN])
  @Put('/settings/tax')
  setTax(@Body() dto: SetTaxDto, @User() user: IUserFromToken): Promise<FinanceSettingsReturnDto> {
    return this.financeService.setTax(dto, user);
  }
}
