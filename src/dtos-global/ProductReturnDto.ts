import { CategoryReturnDto } from '../modules/categories/dto/CategoryReturnDto';
import { ApiProperty } from '@nestjs/swagger';
import { IProductFromDb, IRatingFromDb } from '../modules/products/types';
import { EUserRoles, IUserFromToken } from '../domain/users.domain';
import { ProductDiscountReturnDto } from '../modules/products/dto/ProductDiscountReturnDto';
import { getPriceWithDiscount } from '../utils/prices';

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

  @ApiProperty({ description: 'product price with discount', type: Number })
  priceWithDiscount: number;

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

  @ApiProperty({ description: 'Can add to favourites', type: Boolean })
  canAddToFavourites: boolean;

  @ApiProperty({ description: 'Can add discount', type: Boolean })
  canEditProductDiscount: boolean;

  @ApiProperty({
    description: 'Product discount',
    type: ProductDiscountReturnDto,
    nullable: true
  })
  discount?: ProductDiscountReturnDto | null;

  constructor(product: IProductFromDb, ratings?: IRatingFromDb[], user?: IUserFromToken) {
    this.id = product.id;
    this.name = product.name;
    this.description = product.description;
    this.imageUrl = product.imageUrl;
    this.price = product.price;
    this.priceWithDiscount = product.discount
      ? getPriceWithDiscount(product.price, product.discount.percentage)
      : product.price;
    this.categoryId = product.categoryId;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
    this.category = product.category;
    this.isInFavorites = !!product.favoritesProductsOnUser.length;
    this.canAddReview = !product.reviews?.length && !!user;
    this.canEdit = !!user?.roles.includes(EUserRoles.ADMIN);
    this.canDelete = !!user?.roles.includes(EUserRoles.ADMIN);
    this.canEditProductDiscount = !!user?.roles.includes(EUserRoles.ADMIN);
    this.canAddToFavourites = !!user;
    this.discount = product.discount;

    const rating = ratings?.find((rate) => rate.productId === product.id);

    this.rating = rating?._avg?.rating || null;
  }
}
