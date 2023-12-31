import { IProductReviewFromDb } from '../modules/product-reviews/types';
import { EUserRoles, IUserFromToken } from '../domain/users';
import { ApiProperty } from '@nestjs/swagger';

export class ProductReviewReturnDto {
  @ApiProperty({ description: 'review id', type: String })
  id: string;

  @ApiProperty({ description: 'review rating', type: Number })
  rating: number;

  @ApiProperty({ description: 'review text', type: String })
  text: string;

  @ApiProperty({ description: 'user id', type: String })
  userId: string;

  @ApiProperty({ description: 'review product id', type: String })
  productId: string;

  @ApiProperty({ description: 'review created date', type: String })
  createdAt: Date;

  @ApiProperty({ description: 'review updated date', type: String })
  updatedAt: Date;

  @ApiProperty({ description: 'review author name', type: String })
  authorName: string;

  @ApiProperty({ description: 'review can delete flag', type: Boolean })
  canDelete: boolean;

  constructor(review: IProductReviewFromDb, currentUser?: IUserFromToken) {
    this.id = review.id;
    this.rating = review.rating;
    this.text = review.text;
    this.userId = review.userId;
    this.productId = review.productId;
    this.createdAt = review.createdAt;
    this.updatedAt = review.updatedAt;
    this.authorName = review.user.name;
    this.canDelete =
      currentUser?.id === review.userId || currentUser?.roles.includes(EUserRoles.ADMIN);
  }
}
