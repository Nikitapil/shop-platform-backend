import { CreateOrderDto } from './dto/CreateOrderDto';
import { IUserFromToken } from '../../domain/users.domain';
import { IProductFromDb } from '../products/types';
import { GetOrdersQueryDto } from './dto/GetOrdersQueryDto';
import { UpdateOrderStatusDto } from './dto/UpdateOrderStatusDto';
import { UserReturnDto } from '../../dtos-global/UserReturnDto';

export interface ICreateOrderParams {
  dto: CreateOrderDto;
  user: IUserFromToken;
}

export interface IGetOrdersParams {
  dto: GetOrdersQueryDto;
  user: IUserFromToken;
}

export interface IUpdateOrderStatusParams {
  dto: UpdateOrderStatusDto;
  user: IUserFromToken;
}

export interface IGetSingleOrderParams {
  orderId: string;
  user: IUserFromToken;
}

export interface IProductsInOrder {
  id: string;
  orderId: string;
  productId: string;
  count: number;
  product: IProductFromDb;
}

export interface IOrderFromDb {
  id: string;
  userId: string;
  address: string;
  phone: string;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
  price: number;
  status: string;
  productsInOrder: IProductsInOrder[];
  cancelReason?: string;
  user: UserReturnDto;
}
