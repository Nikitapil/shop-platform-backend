import { CreateProductDto } from './dto/CreateProductDto';
import { UpdateProductDto } from './dto/UpdateProductDto';
import { ToggleFavoritesDto } from './dto/ToggleFavoritesDto';
import { IUserFromToken, IUserParam } from '../../domain/users';
import { GetProductsQueryDto } from './dto/GetProductsQueryDto';
import { CategoryReturnDto } from '../../dtos-global/CategoryReturnDto';
import { Prisma } from '@prisma/client';

export interface ICreateProductParams {
  dto: CreateProductDto;
  file: Express.Multer.File;
  user?: IUserFromToken;
}

export interface IUpdateProductParams {
  dto: UpdateProductDto;
  file: Express.Multer.File;
  user?: IUserFromToken;
}

export interface IToggleFavoritesParams extends IUserParam {
  dto: ToggleFavoritesDto;
}

export interface IGetProductsParams {
  dto: GetProductsQueryDto;
  user?: IUserFromToken;
}

export interface IGetSingleProductParams {
  id: string;
  user?: IUserFromToken;
}

export interface IFavoritesProductsOnUser {
  id: string;
  userId: string;
  productId: string;
}

export interface IProductFromDb {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  category: CategoryReturnDto;
  favoritesProductsOnUser: IFavoritesProductsOnUser[];
}

export interface IRatingFromDb {
  _avg: {
    rating: number;
  };
  productId: string;
}

export interface IGetManyQuizzesParams {
  page: number;
  limit: number;
  where: Prisma.ProductWhereInput;
  order: Prisma.ProductOrderByWithRelationInput;
  user?: IUserFromToken;
}
