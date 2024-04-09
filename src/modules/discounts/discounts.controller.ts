import { Body, Controller, Post } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { Roles } from '../../decorators/Roles.decorator';
import { EUserRoles, IUserFromToken } from '../../domain/users';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DiscountReturnDto } from './dto/DiscountReturnDto';
import { CreateDiscountDto } from './dto/CreateDiscountDto';
import { User } from '../../decorators/User.decorator';

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
}
