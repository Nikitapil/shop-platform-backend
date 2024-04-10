import { IProductFromDb } from '../products/types';
import { CreateDiscountDto } from './dto/CreateDiscountDto';
import { IUserFromToken } from '../../domain/users';
import { EditDiscountDto } from './dto/EditDiscountDto';

export interface IDiscountFromDb {
  id: string;
  name: string;
  percentage: number;
  products: IProductFromDb[];
}

export interface ICreateDiscountParams {
  dto: CreateDiscountDto;
  user: IUserFromToken;
}

export interface IEditDiscountParams {
  dto: EditDiscountDto;
  user: IUserFromToken;
}
