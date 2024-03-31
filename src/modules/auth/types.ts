import { UpdateUserDataDto } from './dto/UpdateUserDataDto';
import { IUserFromToken } from '../../domain/users';
import { ChangePasswordDto } from './dto/ChangePasswordDto';

export interface IUpdateUserDataParams {
  dto: UpdateUserDataDto;
  user: IUserFromToken;
}

export interface IChangePasswordParams {
  dto: ChangePasswordDto;
  user: IUserFromToken;
}
