import { Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../guards/auth/jwt.guard';
import { CreateReviewDto } from './dto/CreateReviewDto';
import { User } from '../../decorators/User.decorator';
import { IUserFromToken } from '../../domain/users';
import { ProductReviewsService } from './product-reviews.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductReviewReturnDto } from '../../dtos-global/ProductReviewReturnDto';
import { SuccessMessageDto } from '../../dtos-global/SuccessMessageDto';

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
}
