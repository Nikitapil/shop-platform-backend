import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../../guards/auth/jwt.guard';
import { AddToCartDto } from './dto/AddToCartDto';
import { User } from '../../decorators/User.decorator';
import { IUserFromToken } from '../../domain/users';
import { CartService } from './cart.service';
import { RemoveFromCartDto } from './dto/RemoveFromCartDto';
import { CartReturnDto } from '../../dtos-global/CartReturnDto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}
  // TODO описать все методы и дто для сваггера
  @ApiOperation({ summary: 'Add product to cart' })
  @ApiResponse({ status: 200, type: CartReturnDto })
  @UseGuards(JwtGuard)
  @Put('/add')
  addToCart(
    @Body() dto: AddToCartDto,
    @User() user: IUserFromToken
  ): Promise<CartReturnDto> {
    return this.cartService.addToCart({ dto, user });
  }

  @ApiOperation({ summary: 'remove product from cart' })
  @ApiResponse({ status: 200, type: CartReturnDto })
  @UseGuards(JwtGuard)
  @Put('/remove')
  removeFromCart(
    @Body() dto: RemoveFromCartDto,
    @User() user: IUserFromToken
  ): Promise<CartReturnDto> {
    return this.cartService.removeFromCart({ dto, user });
  }

  @UseGuards(JwtGuard)
  @Get()
  getCart(@User() user: IUserFromToken): Promise<CartReturnDto> {
    return this.cartService.getCart(user);
  }
}
