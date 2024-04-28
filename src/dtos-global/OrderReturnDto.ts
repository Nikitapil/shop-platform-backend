import { ProductInOrderReturnDto } from './ProductInOrderReturnDto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IOrderFromDb } from '../modules/orders/types';
import { ProductReturnDto } from './ProductReturnDto';
import { UserReturnDto } from './UserReturnDto';
import { EUserRoles, IUserFromToken } from '../domain/users';
import { EOrderStatuses } from '../domain/orders';
import { OrderStatusEnum } from './OrderStatusEnum';

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
      this.checkIsOwnerOrAdmin(order, user) && order.status !== EOrderStatuses.CLOSED;

    this.canSetInProgress =
      this.checkIsAdmin(user) && order.status !== EOrderStatuses.CLOSED;

    this.canSetCreated =
      this.checkIsAdmin(user) && order.status !== EOrderStatuses.CLOSED;

    this.canSetClosed =
      this.checkIsAdmin(user) &&
      order.status !== EOrderStatuses.CANCELED &&
      order.status !== EOrderStatuses.CLOSED;
  }

  private checkIsAdmin(user: IUserFromToken) {
    return user.roles.includes(EUserRoles.ADMIN);
  }

  private checkIsOwnerOrAdmin(order: IOrderFromDb, user: IUserFromToken) {
    return order.userId === user.id || this.checkIsAdmin(user);
  }
}
