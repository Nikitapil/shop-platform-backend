import { ProductInOrderReturnDto } from './ProductInOrderReturnDto';
import { ApiProperty } from '@nestjs/swagger';
import { IOrderFromDb } from '../modules/orders/types';
import { ProductReturnDto } from './ProductReturnDto';

export class OrderReturnDto {
  @ApiProperty({ description: 'order id', type: String })
  id: string;

  @ApiProperty({ description: 'order user id', type: String })
  userId: string;

  @ApiProperty({ description: 'order address', type: String })
  address: string;

  @ApiProperty({ description: 'order phone', type: String })
  phone: string;

  @ApiProperty({ description: 'order comment', type: String, nullable: true })
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
    enum: ['CREATED', 'INPROGRESS', 'CANCELED', 'CLOSED']
  })
  status: string;

  @ApiProperty({ description: 'order products', type: [ProductInOrderReturnDto] })
  productsInOrder: ProductInOrderReturnDto[];

  constructor(order: IOrderFromDb) {
    this.id = order.id;
    this.userId = order.userId;
    this.address = order.address;
    this.phone = order.phone;
    this.comment = order.comment;
    this.createdAt = order.createdAt;
    this.updatedAt = order.updatedAt;
    this.price = order.price;
    this.status = order.status;
    this.productsInOrder = order.productsInOrder.map((productInOrder) => ({
      ...productInOrder,
      product: new ProductReturnDto(productInOrder.product)
    }));
  }
}