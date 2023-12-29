import { OrderReturnDto } from './OrderReturnDto';
import { CartReturnDto } from './CartReturnDto';
import { IOrderFromDb } from '../modules/orders/types';
import { ICartFromDb } from '../modules/cart/types';

export class CreateOrderReturnDto {
  order: OrderReturnDto;
  cart: CartReturnDto;

  constructor(order: IOrderFromDb, cart: ICartFromDb) {
    this.order = new OrderReturnDto(order);
    this.cart = new CartReturnDto(cart);
  }
}
