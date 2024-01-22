import { CategoryReturnDto } from './CategoryReturnDto';
import { ApiProperty } from '@nestjs/swagger';
import { IProductFromDb, IRatingFromDb } from '../modules/products/types';
import {EUserRoles, IUserFromToken} from '../domain/users';

export class ProductReturnDto {
  @ApiProperty({ description: 'product id', type: String })
  id: string;

  @ApiProperty({ description: 'product name', type: String })
  name: string;

  @ApiProperty({ description: 'product description', type: String })
  description: string;

  @ApiProperty({ description: 'product imageUrl', type: String })
  imageUrl: string;

  @ApiProperty({ description: 'product price', type: Number })
  price: number;

  @ApiProperty({ description: 'product category id', type: String })
  categoryId: string;

  @ApiProperty({ description: 'product created at Date', type: String })
  createdAt: Date;

  @ApiProperty({ description: 'product updated at Date', type: String })
  updatedAt: Date;

  @ApiProperty({ description: 'product category', type: CategoryReturnDto })
  category: CategoryReturnDto;

  @ApiProperty({ description: 'in favorites flag', type: Boolean })
  isInFavorites: boolean;

  @ApiProperty({ description: 'Product rating', type: Number, nullable: true })
  rating: number | null;

  @ApiProperty({ description: 'Can add review flag', type: Boolean })
  canAddReview: boolean;

  @ApiProperty({ description: 'Can edit product flag', type: Boolean })
  canEdit: boolean;

  @ApiProperty({ description: 'Can delete product flag', type: Boolean })
  canDelete: boolean;

  constructor(product: IProductFromDb, ratings?: IRatingFromDb[], user?: IUserFromToken) {
    this.id = product.id;
    this.name = product.name;
    this.description = product.description;
    this.imageUrl = product.imageUrl;
    this.price = product.price;
    this.categoryId = product.categoryId;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
    this.category = product.category;
    this.isInFavorites = !!product.favoritesProductsOnUser.length;
    this.canAddReview = !product.reviews?.length && !!user;
    this.canEdit = user.roles.includes(EUserRoles.ADMIN);
    this.canDelete = user.roles.includes(EUserRoles.ADMIN);

    const rating = ratings?.find((rate) => rate.productId === product.id);

    this.rating = rating?._avg?.rating || null;
  }
}
