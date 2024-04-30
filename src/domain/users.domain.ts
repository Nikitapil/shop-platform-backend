export enum EUserRoles {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface IUserFromToken {
  id: string;
  email: string;
  roles: EUserRoles[];
  cartId: string;
}

export interface IUserParam {
  user: IUserFromToken;
}
