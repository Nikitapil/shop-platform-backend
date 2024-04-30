import { ProductReviewReturnDto } from '../../../dtos-global/ProductReviewReturnDto';
import { ApiProperty } from '@nestjs/swagger';

export class GetProductsReviewsReturnDto {
  @ApiProperty({ description: 'Product reviews', type: [ProductReviewReturnDto] })
  reviews: ProductReviewReturnDto[];

  @ApiProperty({ description: 'Total count of product reviews', type: Number })
  totalCount: number;
}
