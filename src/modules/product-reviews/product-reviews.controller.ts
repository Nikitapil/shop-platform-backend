import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../guards/auth/jwt.guard';
import { CreateReviewDto } from './dto/CreateReviewDto';
import { User } from '../../decorators/User.decorator';
import { IUserFromToken } from '../../domain/users';
import { ProductReviewsService } from './product-reviews.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductReviewReturnDto } from '../../dtos-global/ProductReviewReturnDto';

@ApiTags('Product reviews')
@Controller('product-reviews')
export class ProductReviewsController {
  constructor(private reviewService: ProductReviewsService) {}

  @ApiOperation({ summary: 'Create product review' })
  @ApiResponse({ status: 201, type: ProductReviewReturnDto })
  @UseGuards(JwtGuard)
  @Post()
  createReview(
    @Body() dto: CreateReviewDto,
    @User() user: IUserFromToken
  ): Promise<ProductReviewReturnDto> {
    return this.reviewService.createReview({ dto, user });
  }
}
