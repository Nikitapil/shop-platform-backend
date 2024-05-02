import { IProductFromDb } from '../products/types';
import { CreateDiscountDto } from './dto/CreateDiscountDto';
import { IUserFromToken, IUserParam } from '../../domain/users.domain';
import { EditDiscountDto } from './dto/EditDiscountDto';

export interface IDiscountFromDb {
  id: string;
  name: string;
  percentage: number;
  products: IProductFromDb[];
  _count: { products: number };
}

export interface ICreateDiscountParams {
  dto: CreateDiscountDto;
  user: IUserFromToken;
}

export interface IEditDiscountParams {
  dto: EditDiscountDto;
  user: IUserFromToken;
}

export interface IGetSingleDiscountParams extends IUserParam {
  id: string;
}
