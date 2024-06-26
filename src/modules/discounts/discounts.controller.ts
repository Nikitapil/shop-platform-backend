import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards
} from '@nestjs/common';

import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { DiscountsService } from './discounts.service';

import { Roles } from '../../decorators/Roles.decorator';
import { User } from '../../decorators/User.decorator';

import { ApplyUserGuard } from '../../guards/users/apply-user.guard';

import { EUserRoles, IUserFromToken } from '../../domain/users.domain';

import { DiscountReturnDto } from './dto/DiscountReturnDto';
import { CreateDiscountDto } from './dto/CreateDiscountDto';
import { SuccessMessageDto } from '../../dtos-global/SuccessMessageDto';
import { EditDiscountDto } from './dto/EditDiscountDto';

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

  @ApiOperation({ summary: 'Get discounts', operationId: 'getDiscounts' })
  @ApiResponse({ status: 200, type: [DiscountReturnDto] })
  @UseGuards(ApplyUserGuard)
  @Get()
  getDiscounts(@User() user?: IUserFromToken): Promise<DiscountReturnDto[]> {
    return this.discountsService.getDiscounts(user);
  }

  @ApiOperation({ summary: 'Get single discount', operationId: 'getSingleDiscount' })
  @ApiResponse({ status: 200, type: DiscountReturnDto })
  @UseGuards(ApplyUserGuard)
  @Get(':id')
  getSingleDiscount(
    @Param('id') id: string,
    @User() user?: IUserFromToken
  ): Promise<DiscountReturnDto> {
    return this.discountsService.getSingleDiscount({ id, user });
  }

  @ApiOperation({ summary: 'Delete discounts', operationId: 'deleteDiscount' })
  @ApiResponse({ status: 200, type: SuccessMessageDto })
  @Roles([EUserRoles.ADMIN])
  @Delete(':id')
  deleteDiscount(@Param('id') id: string): Promise<SuccessMessageDto> {
    return this.discountsService.deleteDiscount(id);
  }

  @ApiOperation({ summary: 'Edit discounts', operationId: 'editDiscount' })
  @ApiResponse({ status: 200, type: DiscountReturnDto })
  @Roles([EUserRoles.ADMIN])
  @Put()
  editDiscount(
    @Body() dto: EditDiscountDto,
    @User() user: IUserFromToken
  ): Promise<DiscountReturnDto> {
    return this.discountsService.editDiscount({ dto, user });
  }
}
