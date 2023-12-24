import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ICreateProductParams } from './types';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  async createProduct({ file, dto }: ICreateProductParams) {
    console.log(file);
  }
}
