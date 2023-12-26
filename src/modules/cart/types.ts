import { AddToCartDto } from './dto/AddToCartDto';
import { IUserParam } from '../../domain/users';
import { RemoveFromCartDto } from './dto/RemoveFromCartDto';

export interface IAddToCartParams extends IUserParam {
  dto: AddToCartDto;
}

export interface IRemoveFromCartParams extends IUserParam {
  dto: RemoveFromCartDto;
}
