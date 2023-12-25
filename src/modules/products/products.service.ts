import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ICreateProductParams, IUpdateProductParams } from './types';
import { createFileLink, deleteFile } from '../../utils/files';
import { GetProductsQueryDto } from './dto/GetProductsQueryDto';
import { getOffset } from '../../utils/pagination';
import { Prisma } from '@prisma/client';
import { SuccessMessageDto } from '../../dtos-global/SuccessMessageDto';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  async createProduct({ file, dto }: ICreateProductParams) {
    if (!file) {
      throw new BadRequestException('No image for product');
    }

    const imageUrl = createFileLink('/products', file.filename);

    try {
      const category = await this.getCategoryById(dto.categoryId);
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

  async editProduct({ file, dto }: IUpdateProductParams) {
    const { id, ...data } = dto;

    const product = await this.getProductById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!file) {
      throw new BadRequestException('No image for product');
    }

    deleteFile(product.imageUrl);

    const imageUrl = createFileLink('/products', file.filename);

    try {
      const category = await this.getCategoryById(dto.categoryId);
      if (!category) {
        throw new BadRequestException('Invalid categoryId');
      }
      return await this.prismaService.product.update({
        where: { id },
        data: {
          ...data,
          imageUrl
        },
        include: {
          category: true
        }
      });
    } catch (e) {
      throw new BadRequestException(e.message || 'Error while editing product');
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

  async deleteProduct(id: string) {
    try {
      const product = await this.getProductById(id);
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      await this.prismaService.product.delete({
        where: { id }
      });

      deleteFile(product.imageUrl);
      return new SuccessMessageDto();
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new BadRequestException(e.message || 'Error while deleting product');
    }
  }

  private async getCategoryById(id: string) {
    return this.prismaService.productCategory.findUnique({
      where: { id }
    });
  }

  private async getProductById(id: string) {
    return this.prismaService.product.findUnique({
      where: { id }
    });
  }
}
