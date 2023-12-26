import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IAddToCartParams } from './types';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart({ dto, user }: IAddToCartParams) {
    const { cartId } = user;
    const { productId } = dto;

    const product = await this.prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new NotFoundException('product not found');
    }

    try {
      const cart = await this.prisma.cart.update({
        where: { id: cartId },
        data: {
          productInCart: {
            upsert: {
              where: {
                uniqKey: {
                  cartId,
                  productId
                }
              },
              create: {
                productId,
                count: 1
              },
              update: {
                count: {
                  increment: 1
                }
              }
            }
          },
          price: {
            increment: product.price
          }
        },
        include: {
          productInCart: {
            include: {
              product: true
            }
          }
        }
      });
      return { cart };
    } catch (e) {
      throw new BadRequestException(e.message || 'Error while adding product to cart');
    }
  }
}
