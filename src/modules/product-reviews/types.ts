import { CreateReviewDto } from './dto/CreateReviewDto';
import { IUserFromToken } from '../../domain/users';
import { GetReviewsQueryDto } from './dto/GetReviewsQueryDto';

export interface ICreateReviewParams {
  dto: CreateReviewDto;
  user: IUserFromToken;
}

export interface IDeleteReviewParams {
  id: string;
  user: IUserFromToken;
}

export interface IGetReviewsParams {
  dto: GetReviewsQueryDto;
  user?: IUserFromToken | null;
}

export interface IProductReviewFromDb {
  id: string;
  rating: number;
  text: string;
  userId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
  };
}
