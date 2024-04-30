import { CreateProductDto } from './dto/CreateProductDto';
import { UpdateProductDto } from './dto/UpdateProductDto';
import { ToggleFavoritesDto } from './dto/ToggleFavoritesDto';
import { IUserFromToken, IUserParam } from '../../domain/users.domain';
import { GetProductsQueryDto } from './dto/GetProductsQueryDto';
import { CategoryReturnDto } from '../categories/dto/CategoryReturnDto';
import { Prisma } from '@prisma/client';
import { GetFavoriteProductsDto } from './dto/GetFavoriteProductsDto';
import { ProductDiscountReturnDto } from './dto/ProductDiscountReturnDto';
import {EditProductDiscountDto} from "./dto/EditProductDiscountDto";

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

export interface IGetFavoriteProductsParams {
  dto: GetFavoriteProductsDto;
  user: IUserFromToken;
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

export interface IProductReview {
  id: string;
  rating: number;
  text: string;
  userId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
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
  discount: ProductDiscountReturnDto | null;
  favoritesProductsOnUser: IFavoritesProductsOnUser[];
  reviews: IProductReview[];
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

export interface IEditProductDiscountParams {
  dto: EditProductDiscountDto;
  user?: IUserFromToken;
}
