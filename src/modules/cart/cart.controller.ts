import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../../guards/auth/jwt.guard';
import { AddToCartDto } from './dto/AddToCartDto';
import { User } from '../../decorators/User.decorator';
import { IUserFromToken } from '../../domain/users';
import { CartService } from './cart.service';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @UseGuards(JwtGuard)
  @Post('/add')
  addToCart(@Body() dto: AddToCartDto, @User() user: IUserFromToken) {
    return this.cartService.addToCart({ dto, user });
  }
}
