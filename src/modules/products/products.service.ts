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

    return createFileLink('/products', file.filename);
  }
}
