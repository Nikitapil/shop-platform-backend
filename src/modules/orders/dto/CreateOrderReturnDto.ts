import { OrderReturnDto } from '../../../dtos-global/OrderReturnDto';
import { CartReturnDto } from '../../cart/dto/CartReturnDto';
import { IOrderFromDb } from '../types';
import { ICartFromDb } from '../../cart/types';
import { ApiProperty } from '@nestjs/swagger';
import { IUserFromToken } from '../../../domain/users.domain';
import { IFinanceSettingsFromDb } from '../../finance/types';

interface ICreateOrderReturnDtoParams {
  order: IOrderFromDb;
  cart: ICartFromDb;
  user: IUserFromToken;
  financeSettings: IFinanceSettingsFromDb;
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

  constructor({ order, cart, user, financeSettings }: ICreateOrderReturnDtoParams) {
    this.order = new OrderReturnDto(order, user);
    this.cart = new CartReturnDto(cart, financeSettings);
  }
}
