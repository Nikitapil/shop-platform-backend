import { Body, Controller, Get, Patch, Put, UseGuards } from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '../../guards/auth/jwt.guard';

import { User } from '../../decorators/User.decorator';

import { IUserFromToken } from '../../domain/users.domain';

import { CartService } from './cart.service';

import { AddToCartDto } from './dto/AddToCartDto';
import { RemoveFromCartDto } from './dto/RemoveFromCartDto';
import { CartReturnDto } from './dto/CartReturnDto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @ApiOperation({ summary: 'Add product to cart', operationId: 'addToCart' })
  @ApiResponse({ status: 200, type: CartReturnDto })
  @UseGuards(JwtGuard)
  @Put('/add')
  addToCart(
    @Body() dto: AddToCartDto,
    @User() user: IUserFromToken
  ): Promise<CartReturnDto> {
    return this.cartService.addToCart({ dto, user });
  }

  @ApiOperation({ summary: 'remove product from cart', operationId: 'removeFromCart' })
  @ApiResponse({ status: 200, type: CartReturnDto })
  @UseGuards(JwtGuard)
  @Put('/remove')
  removeFromCart(
    @Body() dto: RemoveFromCartDto,
    @User() user: IUserFromToken
  ): Promise<CartReturnDto> {
    return this.cartService.removeFromCart({ dto, user });
  }

  @ApiOperation({ summary: 'Get cart', operationId: 'getCart' })
  @ApiResponse({ status: 200, type: CartReturnDto })
  @UseGuards(JwtGuard)
  @Get()
  getCart(@User() user: IUserFromToken): Promise<CartReturnDto> {
    return this.cartService.getCart(user);
  }

  @ApiOperation({ summary: 'Clear cart', operationId: 'clearCart' })
  @ApiResponse({ status: 200, type: CartReturnDto })
  @UseGuards(JwtGuard)
  @Patch('/clear')
  clearCart(@User() user: IUserFromToken) {
    return this.cartService.clearCart(user);
  }
}
