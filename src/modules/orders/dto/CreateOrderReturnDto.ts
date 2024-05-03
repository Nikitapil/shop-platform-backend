import { ApiProperty } from '@nestjs/swagger';

import { ICartFromDb } from '../../cart/types';
import { IOrderFromDb } from '../types';
import { IUserFromToken } from '../../../domain/users.domain';
import { IFinanceSettingsFromDb } from '../../finance/types';

import { OrderReturnDto } from './OrderReturnDto';
import { CartReturnDto } from '../../cart/dto/CartReturnDto';

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
