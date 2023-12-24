import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ICreateProductParams } from './types';
import { createFileLink } from '../../utils/files';

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
}
