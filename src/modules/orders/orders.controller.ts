import { Body, Controller, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtGuard } from '../../guards/auth/jwt.guard';
import { CreateOrderDto } from './dto/CreateOrderDto';
import { User } from '../../decorators/User.decorator';
import { EUserRoles, IUserFromToken } from '../../domain/users';
import { CreateOrderReturnDto } from '../../dtos-global/CreateOrderReturnDto';
import { GetOrdersQueryDto } from './dto/GetOrdersQueryDto';
import { GetOrdersReturnDto } from '../../dtos-global/GetOrdersReturnDto';
import { Roles } from '../../decorators/Roles.decorator';
import { UpdateOrderStatusDto } from './dto/UpdateOrderStatusDto';
import { SuccessMessageDto } from '../../dtos-global/SuccessMessageDto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Create order' })
  @ApiResponse({ status: 201, type: CreateOrderReturnDto })
  @UseGuards(JwtGuard)
  @Post()
  createOrder(
    @Body() dto: CreateOrderDto,
    @User() user: IUserFromToken
  ): Promise<CreateOrderReturnDto> {
    return this.ordersService.createOrder({ dto, user });
  }

  @ApiOperation({ summary: 'Get orders' })
  @ApiResponse({ status: 200, type: GetOrdersReturnDto })
  @UseGuards(JwtGuard)
  @Get()
  getOrders(
    @Query() dto: GetOrdersQueryDto,
    @User() user: IUserFromToken
  ): Promise<GetOrdersReturnDto> {
    return this.ordersService.getOrders({ dto, user });
  }

  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({ status: 200, type: SuccessMessageDto })
  @Roles([EUserRoles.ADMIN])
  @Put()
  updateOrderStatus(@Body() dto: UpdateOrderStatusDto): Promise<SuccessMessageDto> {
    return this.ordersService.updateOrderStatus({ dto });
  }
}
