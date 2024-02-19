import { OrderReturnDto } from './OrderReturnDto';
import { CartReturnDto } from './CartReturnDto';
import { IOrderFromDb } from '../modules/orders/types';
import { ICartFromDb } from '../modules/cart/types';
import { ApiProperty } from '@nestjs/swagger';

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

  constructor(order: IOrderFromDb, cart: ICartFromDb) {
    this.order = new OrderReturnDto(order);
    this.cart = new CartReturnDto(cart);
  }
}
