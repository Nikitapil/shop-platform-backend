import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { DiscountsService } from './discounts.service';

import { Roles } from '../../decorators/Roles.decorator';
import { User } from '../../decorators/User.decorator';
import { ApplyUserGuard } from '../../guards/users/apply-user.guard';

import { EUserRoles, IUserFromToken } from '../../domain/users';

import { DiscountReturnDto } from './dto/DiscountReturnDto';
import { CreateDiscountDto } from './dto/CreateDiscountDto';
import { SuccessMessageDto } from '../../dtos-global/SuccessMessageDto';

@Controller('discounts')
export class DiscountsController {
  constructor(private discountsService: DiscountsService) {}

  @ApiOperation({ summary: 'Create discount', operationId: 'createDiscount' })
  @ApiResponse({ status: 200, type: DiscountReturnDto })
  @Roles([EUserRoles.ADMIN])
  @Post()
  createDiscount(
    @Body() dto: CreateDiscountDto,
    @User() user: IUserFromToken
  ): Promise<DiscountReturnDto> {
    return this.discountsService.createDiscount({ dto, user });
  }

  @ApiOperation({ summary: 'Get discounts', operationId: 'getDiscount' })
  @ApiResponse({ status: 200, type: [DiscountReturnDto] })
  @UseGuards(ApplyUserGuard)
  @Get()
  getDiscounts(@User() user?: IUserFromToken): Promise<DiscountReturnDto[]> {
    return this.discountsService.getDiscounts(user);
  }

  @ApiOperation({ summary: 'Delete discounts', operationId: 'deleteDiscount' })
  @ApiResponse({ status: 200, type: SuccessMessageDto })
  @Roles([EUserRoles.ADMIN])
  @Delete(':id')
  deleteDiscount(@Param('id') id: string): Promise<SuccessMessageDto> {
    return this.discountsService.deleteDiscount(id);
  }
}
