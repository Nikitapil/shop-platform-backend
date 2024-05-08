import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { createFileLink, deleteFile } from '../../utils/files';
import { getOffset } from '../../utils/pagination';
import { getProductInclude } from './products-db-options';
import { catchError } from '../../utils/errors';

import { PrismaService } from '../prisma/prisma.service';

import {
  ICreateProductParams,
  IEditProductDiscountParams,
  IGetFavoriteProductsParams,
  IGetManyProductsParams,
  IGetProductsParams,
  IGetSingleProductParams,
  IToggleFavoritesParams,
  IUpdateProductParams
} from './types';
import { Prisma } from '@prisma/client';
import { SortingEnum } from '../../domain/common';

import { ProductReturnDto } from './dto/ProductReturnDto';
import { SuccessMessageDto } from '../../dtos-global/SuccessMessageDto';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  private async getCategoryById(id: string) {
    return this.prismaService.productCategory.findUnique({
      where: { id }
    });
  }

  private async checkIsCategoryExist(categoryId: string) {
    const category = await this.getCategoryById(categoryId);

    if (!category) {
      throw new BadRequestException('Invalid categoryId');
    }
  }

  private async getProductById(id: string) {
    return this.prismaService.product.findUnique({
      where: { id }
    });
  }

  private async getProductsRatings(productsIds: string[]) {
    return this.prismaService.productReview.groupBy({
      by: 'productId',
      where: {
        productId: {
          in: productsIds
        }
      },
      _avg: {
        rating: true
      }
    });
  }

  private async getManyProducts({
    page,
    limit,
    where,
    user,
    order
  }: IGetManyProductsParams) {
    const offset = getOffset(page, limit);

    const products = await this.prismaService.product.findMany({
      where,
      orderBy: order,
      take: limit,
      skip: offset,
      include: getProductInclude(user?.id)
    });

    const totalCount = await this.prismaService.product.count({ where });

    const productsIds = products.map((product) => product.id);

    const ratings = await this.getProductsRatings(productsIds);

    try {
      return {
        products: products.map((product) => new ProductReturnDto(product, ratings, user)),
        totalCount
      };
    } catch (e) {
      throw new BadRequestException('Error while getting products');
    }
  }

  async createProduct({ file, dto, user }: ICreateProductParams) {
    if (!file) {
      throw new BadRequestException('No image for product');
    }

    const imageUrl = createFileLink('/products', file.filename);

    try {
      await this.checkIsCategoryExist(dto.categoryId);

      const product = await this.prismaService.product.create({
        data: {
          ...dto,
          imageUrl
        },
        include: getProductInclude(user.id)
      });

      return new ProductReturnDto(product);
    } catch (e: any) {
      catchError(e, 'Error while creating product');
    }
  }

  async editProduct({ file, dto, user }: IUpdateProductParams) {
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
      await this.checkIsCategoryExist(dto.categoryId);

      const product = await this.prismaService.product.update({
        where: { id },
        data: {
          ...data,
          imageUrl
        },
        include: getProductInclude(user?.id)
      });

      return new ProductReturnDto(product);
    } catch (e: any) {
      catchError(e, 'Error while editing product');
    }
  }

  async getProducts({ dto, user }: IGetProductsParams) {
    const { page, limit, priceSorting, search, categoryId } = dto;

    let order: Prisma.ProductOrderByWithRelationInput = {
      name: SortingEnum.ASC
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
      const products = await this.getManyProducts({
        page,
        limit,
        where,
        order,
        user
      });

      return products;
    } catch (e) {
      throw new BadRequestException('Error while getting products');
    }
  }

  async getFavoritesProducts({ dto, user }: IGetFavoriteProductsParams) {
    const { page, limit } = dto;

    const order: Prisma.ProductOrderByWithRelationInput = {
      name: SortingEnum.ASC
    };

    const where: Prisma.ProductWhereInput = {
      favoritesProductsOnUser: {
        some: {
          userId: user.id
        }
      }
    };

    try {
      const products = await this.getManyProducts({
        page,
        limit,
        where,
        order,
        user
      });

      return products;
    } catch (e) {
      throw new BadRequestException('Error while getting products');
    }
  }

  async getProduct({ id, user }: IGetSingleProductParams) {
    const product = await this.prismaService.product.findUnique({
      where: { id },
      include: getProductInclude(user?.id)
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const ratings = await this.getProductsRatings([product.id]);
    return new ProductReturnDto(product, ratings, user);
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
    } catch (e: any) {
      catchError(e, 'Error while deleting product');
    }
  }

  async toggleFavorite({ dto, user }: IToggleFavoritesParams) {
    try {
      const product = await this.prismaService.product.findUnique({
        where: { id: dto.productId },
        include: getProductInclude(user.id)
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      if (!product.favoritesProductsOnUser.length) {
        await this.prismaService.favoritesProductsOnUser.create({
          data: {
            productId: dto.productId,
            userId: user.id
          }
        });

        return { isInFavorites: true };
      } else {
        await this.prismaService.favoritesProductsOnUser.delete({
          where: {
            uniqueKey: {
              userId: user.id,
              productId: dto.productId
            }
          }
        });
        return { isInFavorites: false };
      }
    } catch (e: any) {
      catchError(e, 'Error while switching favorites');
    }
  }

  async editProductDiscount({ dto, user }: IEditProductDiscountParams) {
    try {
      const product = await this.getProductById(dto.productId);

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      if (dto.discountId) {
        const discount = await this.prismaService.discount.findUnique({
          where: { id: dto.discountId }
        });

        if (!discount) {
          throw new NotFoundException('Product not found');
        }
      }

      await this.prismaService.product.update({
        where: { id: dto.productId },
        data: {
          discountId: dto.discountId
        }
      });
      return await this.getProduct({ id: dto.productId, user });
    } catch (e) {
      catchError(e, 'Error while getting products');
    }
  }
}
