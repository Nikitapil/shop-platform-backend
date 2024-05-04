import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { OrdersService } from './orders.service';

import { JwtGuard } from '../../guards/auth/jwt.guard';

import { User } from '../../decorators/User.decorator';

import { IUserFromToken } from '../../domain/users.domain';

import { CreateOrderDto } from './dto/CreateOrderDto';
import { CreateOrderReturnDto } from './dto/CreateOrderReturnDto';
import { GetOrdersQueryDto } from './dto/GetOrdersQueryDto';
import { GetOrdersReturnDto } from './dto/GetOrdersReturnDto';
import { UpdateOrderStatusDto } from './dto/UpdateOrderStatusDto';
import { SuccessMessageDto } from '../../dtos-global/SuccessMessageDto';
import { OrderReturnDto } from './dto/OrderReturnDto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Create order', operationId: 'createOrder' })
  @ApiResponse({ status: 201, type: CreateOrderReturnDto })
  @UseGuards(JwtGuard)
  @Post()
  createOrder(
    @Body() dto: CreateOrderDto,
    @User() user: IUserFromToken
  ): Promise<CreateOrderReturnDto> {
    return this.ordersService.createOrder({ dto, user });
  }

  @ApiOperation({ summary: 'Get orders', operationId: 'getOrders' })
  @ApiResponse({ status: 200, type: GetOrdersReturnDto })
  @UseGuards(JwtGuard)
  @Get()
  getOrders(
    @Query() dto: GetOrdersQueryDto,
    @User() user: IUserFromToken
  ): Promise<GetOrdersReturnDto> {
    return this.ordersService.getOrders({ dto, user });
  }

  @ApiOperation({ summary: 'Get order by id', operationId: 'getOrderById' })
  @ApiResponse({ status: 200, type: OrderReturnDto })
  @UseGuards(JwtGuard)
  @Get(':id')
  getOrderById(
    @Param('id') orderId: string,
    @User() user: IUserFromToken
  ): Promise<OrderReturnDto> {
    return this.ordersService.getSingleOrder({ orderId, user });
  }

  @ApiOperation({ summary: 'Update order status', operationId: 'updateOrderStatus' })
  @ApiResponse({ status: 200, type: SuccessMessageDto })
  @UseGuards(JwtGuard)
  @Put()
  updateOrderStatus(
    @Body() dto: UpdateOrderStatusDto,
    @User() user: IUserFromToken
  ): Promise<SuccessMessageDto> {
    return this.ordersService.updateOrderStatus({ dto, user });
  }
}
