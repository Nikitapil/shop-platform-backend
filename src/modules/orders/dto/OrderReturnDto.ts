import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IOrderFromDb } from '../types';
import { EUserRoles, IUserFromToken } from '../../../domain/users.domain';
import { OrderStatusEnum } from './OrderStatusEnum';

import { UserReturnDto } from '../../../dtos-global/UserReturnDto';
import { ProductReturnDto } from '../../products/dto/ProductReturnDto';
import { ProductInOrderReturnDto } from './ProductInOrderReturnDto';

export class OrderReturnDto {
  @ApiProperty({ description: 'order id', type: String })
  id: string;

  @ApiProperty({ description: 'order user id', type: String })
  userId: string;

  @ApiProperty({ description: 'order address', type: String })
  address: string;

  @ApiProperty({ description: 'order phone', type: String })
  phone: string;

  @ApiPropertyOptional({ description: 'order comment', type: String, nullable: true })
  comment?: string;

  @ApiProperty({ description: 'order created date', type: String })
  createdAt: Date;

  @ApiProperty({ description: 'order updated at date', type: String })
  updatedAt: Date;

  @ApiProperty({ description: 'order price', type: Number })
  price: number;

  @ApiProperty({
    description: 'order status',
    type: String,
    enum: OrderStatusEnum,
    enumName: 'OrderStatusEnum'
  })
  status: string;

  @ApiProperty({ description: 'order products', type: [ProductInOrderReturnDto] })
  productsInOrder: ProductInOrderReturnDto[];

  @ApiProperty({ description: 'can cancel', type: Boolean })
  canCancel: boolean;

  @ApiProperty({ description: 'can set order status in progress', type: Boolean })
  canSetInProgress: boolean;

  @ApiProperty({ description: 'can set order status to created', type: Boolean })
  canSetCreated: boolean;

  @ApiProperty({ description: 'can set order status to closed', type: Boolean })
  canSetClosed: boolean;

  @ApiProperty({ description: 'order user', type: UserReturnDto })
  user?: UserReturnDto;

  @ApiProperty({ description: 'order cancel reason', type: String, nullable: true })
  cancelReason?: string;

  constructor(order: IOrderFromDb, user: IUserFromToken) {
    this.id = order.id;
    this.userId = order.userId;
    this.address = order.address;
    this.phone = order.phone;
    this.comment = order.comment;
    this.createdAt = order.createdAt;
    this.updatedAt = order.updatedAt;
    this.price = order.price;
    this.status = order.status;
    this.cancelReason = order.cancelReason || null;
    this.user = order.user;

    this.productsInOrder = order.productsInOrder.map((productInOrder) => ({
      ...productInOrder,
      product: new ProductReturnDto(productInOrder.product)
    }));

    this.canCancel =
      this.checkIsOwnerOrAdmin(order, user) && this.orderIsNotClosed(order);

    this.canSetInProgress = this.checkIsAdmin(user) && this.orderIsNotClosed(order);

    this.canSetCreated = this.checkIsAdmin(user) && this.orderIsNotClosed(order);

    this.canSetClosed =
      this.checkIsAdmin(user) &&
      this.orderIsNotClosed(order) &&
      order.status !== OrderStatusEnum.CANCELED;
  }

  private checkIsAdmin(user: IUserFromToken) {
    return user.roles.includes(EUserRoles.ADMIN);
  }

  private checkIsOwnerOrAdmin(order: IOrderFromDb, user: IUserFromToken) {
    return order.userId === user.id || this.checkIsAdmin(user);
  }

  private orderIsNotClosed(order: IOrderFromDb) {
    return order.status !== OrderStatusEnum.CLOSED;
  }
}
