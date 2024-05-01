import { AddToCartDto } from './dto/AddToCartDto';
import { IUserParam } from '../../domain/users.domain';
import { RemoveFromCartDto } from './dto/RemoveFromCartDto';
import { IProductFromDb } from '../products/types';

export interface IAddToCartParams extends IUserParam {
  dto: AddToCartDto;
}

export interface IRemoveFromCartParams extends IUserParam {
  dto: RemoveFromCartDto;
}

interface IProductInCart {
  id: string;
  productId: string;
  cartId: string;
  count: number;
  product: IProductFromDb;
}

export interface ICartFromDb {
  id: string;
  productInCart: IProductInCart[];
}
