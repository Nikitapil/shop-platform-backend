import { OrderReturnDto } from './OrderReturnDto';
import { CartReturnDto } from './CartReturnDto';
import { IOrderFromDb } from '../modules/orders/types';
import { ICartFromDb } from '../modules/cart/types';
import { ApiProperty } from '@nestjs/swagger';
import { IUserFromToken } from '../domain/users';

interface ICreateOrderReturnDtoParams {
  order: IOrderFromDb;
  cart: ICartFromDb;
  user: IUserFromToken;
  tax: number;
}

export class CreateOrderReturnDto {
  @ApiProperty({
    description: 'Order object',
    type: OrderReturnDto
  })
  order: OrderReturnDto;

  @ApiProperty({
    description: 'updated cart after create order',
    type: CartReturnDto
  })
  cart: CartReturnDto;

  constructor({ order, cart, user, tax }: ICreateOrderReturnDtoParams) {
    this.order = new OrderReturnDto(order, user);
    this.cart = new CartReturnDto(cart, tax);
  }
}
