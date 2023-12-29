import { CreateOrderDto } from './dto/CreateOrderDto';
import { IUserFromToken } from '../../domain/users';
import { IProductFromDb } from '../products/types';

export interface ICreateOrderParams {
  dto: CreateOrderDto;
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
}
