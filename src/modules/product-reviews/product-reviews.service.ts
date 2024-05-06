import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { ICreateReviewParams, IDeleteReviewParams, IGetReviewsParams } from './types';
import { EUserRoles } from '../../domain/users.domain';

import { getOffset } from '../../utils/pagination';

import { reviewInclude } from './product-reviews-db-options';

import { SuccessMessageDto } from '../../dtos-global/SuccessMessageDto';
import { ProductReviewReturnDto } from './dto/ProductReviewReturnDto';

@Injectable()
export class ProductReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview({ dto, user }: ICreateReviewParams) {
    const candidate = await this.prisma.productReview.findUnique({
      where: {
        unique_key: {
          productId: dto.productId,
          userId: user.id
        }
      }
    });

    if (candidate) {
      throw new NotAcceptableException('You already create review for this product');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId }
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const review = await this.prisma.productReview.create({
      data: {
        productId: dto.productId,
        userId: user.id,
        text: dto.text,
        rating: dto.rating
      },
      include: reviewInclude
    });

    return new ProductReviewReturnDto(review, user);
  }

  async deleteReview({ id, user }: IDeleteReviewParams) {
    const review = await this.prisma.productReview.findUnique({
      where: { id }
    });

    if (!review) {
      throw new NotFoundException('Product review not found');
    }

    const canDelete = user.id === review.userId || user.roles.includes(EUserRoles.ADMIN);

    if (!canDelete) {
      throw new NotAcceptableException('Permission denied');
    }

    try {
      await this.prisma.productReview.delete({ where: { id } });
      return new SuccessMessageDto();
    } catch (e) {
      throw new BadRequestException('Error while deleting product review');
    }
  }

  async getReviews({ dto, user }: IGetReviewsParams) {
    const offset = getOffset(dto.page, dto.limit);
    const reviews = await this.prisma.productReview.findMany({
      where: {
        productId: dto.productId
      },
      include: reviewInclude,
      orderBy: {
        createdAt: 'desc'
      },
      take: dto.limit,
      skip: offset
    });

    const totalCount = await this.prisma.productReview.count({
      where: {
        productId: dto.productId
      }
    });

    return {
      reviews: reviews.map((review) => new ProductReviewReturnDto(review, user)),
      totalCount
    };
  }
}
