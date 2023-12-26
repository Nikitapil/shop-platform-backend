import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../../guards/auth/jwt.guard';
import { AddToCartDto } from './dto/AddToCartDto';
import { User } from '../../decorators/User.decorator';
import { IUserFromToken } from '../../domain/users';
import { CartService } from './cart.service';
import { RemoveFromCartDto } from './dto/RemoveFromCartDto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}
  // TODO описать все методы и дто для сваггера
  @UseGuards(JwtGuard)
  @Put('/add')
  addToCart(@Body() dto: AddToCartDto, @User() user: IUserFromToken) {
    return this.cartService.addToCart({ dto, user });
  }

  @UseGuards(JwtGuard)
  @Put('/remove')
  removeFromCart(@Body() dto: RemoveFromCartDto, @User() user: IUserFromToken) {
    return this.cartService.removeFromCart({ dto, user });
  }
}
