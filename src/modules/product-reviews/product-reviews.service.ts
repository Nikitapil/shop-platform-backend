import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ICreateReviewParams } from './types';
import {ProductReviewReturnDto} from "../../dtos-global/ProductReviewReturnDto";

@Injectable()
export class ProductReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview({ dto, user }: ICreateReviewParams) {
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
}
