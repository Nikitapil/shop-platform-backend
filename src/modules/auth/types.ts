import { UpdateUserDataDto } from './dto/UpdateUserDataDto';
import { IUserFromToken } from '../../domain/users';

export interface IUpdateUserDataParams {
  dto: UpdateUserDataDto;
  user: IUserFromToken;
}
