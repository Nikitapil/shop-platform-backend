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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '../../guards/auth/jwt.guard';
import { ApplyUserGuard } from '../../guards/users/apply-user.guard';

import { User } from '../../decorators/User.decorator';

import { IUserFromToken } from '../../domain/users.domain';

import { ProductReviewsService } from './product-reviews.service';

import { ProductReviewReturnDto } from './dto/ProductReviewReturnDto';
import { SuccessMessageDto } from '../../dtos-global/SuccessMessageDto';
import { GetReviewsQueryDto } from './dto/GetReviewsQueryDto';
import { CreateReviewDto } from './dto/CreateReviewDto';
import { GetProductsReviewsReturnDto } from './dto/GetProductsReviewsReturnDto';

@ApiTags('Product reviews')
@Controller('product-reviews')
export class ProductReviewsController {
  constructor(private reviewService: ProductReviewsService) {}

  @ApiOperation({ summary: 'Create product review', operationId: 'createReview' })
  @ApiResponse({ status: 201, type: ProductReviewReturnDto })
  @UseGuards(JwtGuard)
  @Post()
  createReview(
    @Body() dto: CreateReviewDto,
    @User() user: IUserFromToken
  ): Promise<ProductReviewReturnDto> {
    return this.reviewService.createReview({ dto, user });
  }

  @ApiOperation({ summary: 'Delete product review', operationId: 'deleteReview' })
  @ApiResponse({ status: 200, type: SuccessMessageDto })
  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteReview(
    @Param('id') id: string,
    @User() user: IUserFromToken
  ): Promise<SuccessMessageDto> {
    return this.reviewService.deleteReview({ id, user });
  }

  @ApiOperation({ summary: 'Get product reviews', operationId: 'getReviews' })
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
