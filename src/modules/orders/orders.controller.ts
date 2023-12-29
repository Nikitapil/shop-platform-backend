import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtGuard } from '../../guards/auth/jwt.guard';
import { CreateOrderDto } from './dto/CreateOrderDto';
import { User } from '../../decorators/User.decorator';
import { IUserFromToken } from '../../domain/users';
import { CreateOrderReturnDto } from '../../dtos-global/CreateOrderReturnDto';

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
}
