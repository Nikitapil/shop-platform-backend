import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ICreateProductParams } from './types';
import { createFileLink } from '../../utils/files';
import { GetProductsQueryDto } from './dto/GetProductsQueryDto';
import { getOffset } from '../../utils/pagination';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  async createProduct({ file, dto }: ICreateProductParams) {
    if (!file) {
      throw new BadRequestException('No image for product');
    }

    const imageUrl = createFileLink('/products', file.filename);

    try {
      const category = await this.prismaService.productCategory.findUnique({
        where: { id: dto.categoryId }
      });
      if (!category) {
        throw new BadRequestException('Invalid categoryId');
      }
      return await this.prismaService.product.create({
        data: {
          ...dto,
          imageUrl
        },
        include: {
          category: true
        }
      });
    } catch (e) {
      throw new BadRequestException(e.message || 'Error while creating product');
    }
  }

  async getProducts(dto: GetProductsQueryDto) {
    const { page, limit, priceSorting, search, categoryId } = dto;
    const offset = getOffset(page, limit);

    let order: Prisma.ProductOrderByWithRelationInput = {
      name: 'asc'
    };

    if (priceSorting) {
      order = {
        price: priceSorting
      };
    }

    const where: Prisma.ProductWhereInput = {
      name: {
        contains: search,
        mode: 'insensitive'
      }
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    try {
      return await this.prismaService.product.findMany({
        where,
        orderBy: order,
        take: limit,
        skip: offset,
        include: {
          category: true
        }
      });
    } catch (e) {
      throw new BadRequestException('Error while getting products');
    }
  }
}
