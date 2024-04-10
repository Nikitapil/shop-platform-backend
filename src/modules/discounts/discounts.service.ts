import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { getDiscountsInclude } from '../../db-query-options/discounts-options';

import { ICreateDiscountParams } from './types';
import { IUserFromToken } from '../../domain/users';

import { DiscountReturnDto } from './dto/DiscountReturnDto';
import { SuccessMessageDto } from '../../dtos-global/SuccessMessageDto';

@Injectable()
export class DiscountsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createDiscount({ dto, user }: ICreateDiscountParams) {
    try {
      const discount = await this.prismaService.discount.create({
        data: dto,
        include: getDiscountsInclude(user.id)
      });
      return new DiscountReturnDto(discount);
    } catch (e) {
      throw new BadRequestException(e.message || 'Error while updating tax');
    }
  }

  async getDiscounts(user?: IUserFromToken) {
    try {
      const discounts = await this.prismaService.discount.findMany({
        include: getDiscountsInclude(user?.id)
      });
      return discounts.map((discount) => new DiscountReturnDto(discount));
    } catch (e) {
      throw new BadRequestException(e.message || 'Error while updating tax');
    }
  }

  async deleteDiscount(discountId: string) {
    try {
      const discount = await this.prismaService.discount.findUnique({
        where: { id: discountId }
      });
      if (!discount) {
        throw new NotFoundException('Discount not found');
      }

      await this.prismaService.discount.delete({
        where: { id: discountId }
      });

      return new SuccessMessageDto();
    } catch (e) {
      throw new BadRequestException(e.message || 'Error while updating tax');
    }
  }
}
