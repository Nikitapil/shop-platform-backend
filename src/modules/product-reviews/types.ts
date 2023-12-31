import { CreateReviewDto } from './dto/CreateReviewDto';
import { IUserFromToken } from '../../domain/users';

export interface ICreateReviewParams {
  dto: CreateReviewDto;
  user: IUserFromToken;
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
