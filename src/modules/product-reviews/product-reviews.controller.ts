import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { JwtGuard } from '../../guards/auth/jwt.guard';
import { CreateReviewDto } from './dto/CreateReviewDto';
import { User } from '../../decorators/User.decorator';
import { IUserFromToken } from '../../domain/users';
import { ProductReviewsService } from './product-reviews.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductReviewReturnDto } from '../../dtos-global/ProductReviewReturnDto';
import { SuccessMessageDto } from '../../dtos-global/SuccessMessageDto';
import { ApplyUserGuard } from '../../guards/users/apply-user.guard';
import { GetReviewsQueryDto } from './dto/GetReviewsQueryDto';
import { GetProductsReviewsReturnDto } from '../../dtos-global/GetProductsReviewsReturnDto';

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

  @ApiOperation({ summary: 'Delete product review' })
  @ApiResponse({ status: 200, type: SuccessMessageDto })
  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteReview(
    @Param('id') id: string,
    @User() user: IUserFromToken
  ): Promise<SuccessMessageDto> {
    return this.reviewService.deleteReview({ id, user });
  }

  @ApiOperation({ summary: 'Get product reviews' })
  @ApiResponse({ status: 200, type: GetProductsReviewsReturnDto })
  @UseGuards(ApplyUserGuard)
  @Get()
  getReviews(
    @Query() dto: GetReviewsQueryDto,
    @User() user: IUserFromToken | null
  ): Promise<GetProductsReviewsReturnDto> {
    return this.reviewService.getReviews({ dto, user });
  }
}
