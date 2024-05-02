import { IProductFromDb } from '../products/types';
import { IUserParam } from '../../domain/users.domain';

import { EditDiscountDto } from './dto/EditDiscountDto';
import { CreateDiscountDto } from './dto/CreateDiscountDto';

export interface IDiscountFromDb {
  id: string;
  name: string;
  percentage: number;
  products: IProductFromDb[];
  _count: { products: number };
}

export interface ICreateDiscountParams extends IUserParam {
  dto: CreateDiscountDto;
}

export interface IEditDiscountParams extends IUserParam {
  dto: EditDiscountDto;
}

export interface IGetSingleDiscountParams extends IUserParam {
  id: string;
}
