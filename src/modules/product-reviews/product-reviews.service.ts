import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ICreateReviewParams, IDeleteReviewParams } from './types';
import { ProductReviewReturnDto } from '../../dtos-global/ProductReviewReturnDto';
import { EUserRoles } from '../../domain/users';
import { SuccessMessageDto } from '../../dtos-global/SuccessMessageDto';

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
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
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
}
