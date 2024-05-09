import { IUserParam } from '../../domain/users.domain';
import { Prisma } from '@prisma/client';

import { CategoryReturnDto } from '../categories/dto/CategoryReturnDto';
import { GetProductsQueryDto } from './dto/GetProductsQueryDto';
import { ToggleFavoritesDto } from './dto/ToggleFavoritesDto';
import { UpdateProductDto } from './dto/UpdateProductDto';
import { GetFavoriteProductsDto } from './dto/GetFavoriteProductsDto';
import { ProductDiscountReturnDto } from './dto/ProductDiscountReturnDto';
import { EditProductDiscountDto } from './dto/EditProductDiscountDto';
import { CreateProductDto } from './dto/CreateProductDto';

export interface ICreateProductParams extends IUserParam {
  dto: CreateProductDto;
  file: Express.Multer.File;
}

export interface IUpdateProductParams extends IUserParam {
  dto: UpdateProductDto;
  file: Express.Multer.File;
}

export interface IToggleFavoritesParams extends IUserParam {
  dto: ToggleFavoritesDto;
}

export interface IGetProductsParams extends IUserParam {
  dto: GetProductsQueryDto;
}

export interface IGetFavoriteProductsParams extends IUserParam {
  dto: GetFavoriteProductsDto;
}

export interface IGetSingleProductParams extends IUserParam {
  id: string;
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

export interface IGetManyProductsParams extends IUserParam {
  page: number;
  limit: number;
  where: Prisma.ProductWhereInput;
  order: Prisma.ProductOrderByWithRelationInput;
}

export interface IEditProductDiscountParams extends IUserParam {
  dto: EditProductDiscountDto;
}
