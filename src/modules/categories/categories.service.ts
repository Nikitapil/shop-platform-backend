import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { catchError } from '../../utils/errors';

import { PrismaService } from '../prisma/prisma.service';

import { CreateCategoryDto } from './dto/CreateCategoryDto';
import { UpdateCategoryDto } from './dto/UpdateCategoryDto';
import { SuccessMessageDto } from '../../dtos-global/SuccessMessageDto';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}

  private async getCategoryById(id: string) {
    return this.prismaService.productCategory.findUnique({
      where: { id }
    });
  }

  private async getCategoryByName(name: string) {
    return this.prismaService.productCategory.findUnique({
      where: { name }
    });
  }

  async createCategory(dto: CreateCategoryDto) {
    try {
      const candidate = await this.getCategoryByName(dto.name);

      if (candidate) {
        throw new BadRequestException('Category already exist');
      }

      return await this.prismaService.productCategory.create({
        data: dto
      });
    } catch (e: any) {
      catchError(e, 'Error while creating category');
    }
  }

  async updateCategory(dto: UpdateCategoryDto) {
    try {
      const category = await this.getCategoryById(dto.id);

      if (!category) {
        throw new NotFoundException('category not found');
      }

      if (category.name === dto.name) {
        return category;
      }

      const candidate = await this.getCategoryByName(dto.name);

      if (candidate) {
        throw new BadRequestException(`Category ${dto.name} already exist`);
      }

      return await this.prismaService.productCategory.update({
        where: { id: dto.id },
        data: { name: dto.name }
      });
    } catch (e: any) {
      catchError(e, 'Error while updating category');
    }
  }

  async deleteCategory(id: string) {
    try {
      const category = await this.getCategoryById(id);

      if (!category) {
        throw new NotFoundException('category not found');
      }
      await this.prismaService.productCategory.delete({
        where: { id: id }
      });
      return new SuccessMessageDto();
    } catch (e: any) {
      catchError(e, 'Error while deleting category');
    }
  }

  async getCategories() {
    try {
      return await this.prismaService.productCategory.findMany();
    } catch (e: any) {
      throw new BadRequestException(e.message || 'Error while fetching categories');
    }
  }
}
