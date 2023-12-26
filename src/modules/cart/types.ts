import { AddToCartDto } from './dto/AddToCartDto';
import { IUserParam } from '../../domain/users';

export interface IAddToCartParams extends IUserParam {
  dto: AddToCartDto;
}
