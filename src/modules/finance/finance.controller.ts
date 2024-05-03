import { Body, Controller, Get, Patch, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { FinanceService } from './finance.service';

import { Roles } from '../../decorators/Roles.decorator';
import { User } from '../../decorators/User.decorator';

import { ApplyUserGuard } from '../../guards/users/apply-user.guard';

import { EUserRoles, IUserFromToken } from '../../domain/users.domain';

import { SetTaxDto } from './dto/SetTaxDto';
import { SetAvailableCurrenciesDto } from './dto/SetAvailableCurrenciesDto';
import { FinanceSettingsReturnDto } from './dto/FinanceSettingsReturnDto';
import { SetDeliveryCostDto } from './dto/SetDeliveryCostDto';
import { SetOrderPriceWithFreeDeliveryDto } from './dto/SetOrderPriceWithFreeDeliveryDto';

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
  setTax(
    @Body() dto: SetTaxDto,
    @User() user: IUserFromToken
  ): Promise<FinanceSettingsReturnDto> {
    return this.financeService.setTax({ dto, user });
  }

  @ApiOperation({
    summary: 'Set new delivery cost value',
    operationId: 'setDeliveryCost'
  })
  @ApiResponse({ status: 200, type: FinanceSettingsReturnDto })
  @Roles([EUserRoles.ADMIN])
  @Put('/settings/delivery_cost')
  setDeliveryCost(
    @Body() dto: SetDeliveryCostDto,
    @User() user: IUserFromToken
  ): Promise<FinanceSettingsReturnDto> {
    return this.financeService.setDeliveryCost({ dto, user });
  }

  @ApiOperation({
    summary: 'Set order price with free delivery cost',
    operationId: 'setOrderPriceWithFreeDeliveryCost'
  })
  @ApiResponse({ status: 200, type: FinanceSettingsReturnDto })
  @Roles([EUserRoles.ADMIN])
  @Put('/settings/order_free_delivery_cost')
  setOrderPriceWithFreeDeliveryCost(
    @Body() dto: SetOrderPriceWithFreeDeliveryDto,
    @User() user: IUserFromToken
  ): Promise<FinanceSettingsReturnDto> {
    return this.financeService.setOrderPriceWithFreeDelivery({ dto, user });
  }

  @ApiOperation({
    summary: 'Set available currencies',
    operationId: 'setAvailableCurrencies'
  })
  @ApiResponse({ status: 200, type: FinanceSettingsReturnDto })
  @Roles([EUserRoles.ADMIN])
  @Put('/settings/currencies')
  setAvailableCurrencies(
    @Body() dto: SetAvailableCurrenciesDto,
    @User() user: IUserFromToken
  ): Promise<FinanceSettingsReturnDto> {
    return this.financeService.setAvailableCurrencies({ dto, user });
  }

  @ApiOperation({
    summary: 'Update exchange rates',
    operationId: 'updateExchangeRates'
  })
  @ApiResponse({ status: 200, type: FinanceSettingsReturnDto })
  @Roles([EUserRoles.ADMIN])
  @Patch('/settings/rates')
  updateExchangeRates(@User() user: IUserFromToken): Promise<FinanceSettingsReturnDto> {
    return this.financeService.updateExchangeRates(user);
  }
}
