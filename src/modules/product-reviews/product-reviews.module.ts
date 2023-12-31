import { Module } from '@nestjs/common';
import { ProductReviewsController } from './product-reviews.controller';
import { ProductReviewsService } from './product-reviews.service';

@Module({
  controllers: [ProductReviewsController],
  providers: [ProductReviewsService]
})
export class ProductReviewsModule {}
