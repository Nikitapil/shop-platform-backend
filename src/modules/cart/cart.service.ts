import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IAddToCartParams, ICartFromDb, IRemoveFromCartParams } from './types';
import { Prisma } from '@prisma/client';
import { IUserFromToken } from '../../domain/users';
import { getCartInclude } from '../../db-query-options/cart-options';
import { CartReturnDto } from '../../dtos-global/CartReturnDto';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService, private sharedService: SharedService) {}

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
        include: getCartInclude(user.id)
      });
      return await this.createCartReturnDto(cart);
    } catch (e) {
      throw new BadRequestException(e.message || 'Error while adding product to cart');
    }
  }

  async removeFromCart({ dto, user }: IRemoveFromCartParams) {
    const { cartId } = user;
    const { productInCartId } = dto;

    const productInCart = await this.prisma.productInCart.findUnique({
      where: { id: productInCartId },
      include: {
        product: true
      }
    });

    if (!productInCart) {
      throw new BadRequestException('product is not in cart');
    }

    try {
      const productInCartInput: Prisma.CartUpdateInput['productInCart'] =
        productInCart.count === 1
          ? {
              delete: {
                id: productInCartId
              }
            }
          : {
              update: {
                where: {
                  id: productInCartId
                },
                data: {
                  count: {
                    decrement: 1
                  }
                }
              }
            };

      const cart = await this.prisma.cart.update({
        where: { id: cartId },
        data: {
          productInCart: productInCartInput,
          price: {
            decrement: productInCart.product.price
          }
        },
        include: getCartInclude(user.id)
      });

      return await this.createCartReturnDto(cart);
    } catch (e) {
      throw new BadRequestException(e.message || 'Error while adding product to cart');
    }
  }

  async getCart(user: IUserFromToken) {
    try {
      const cart = await this.prisma.cart.findUnique({
        where: { id: user.cartId },
        include: getCartInclude(user.id)
      });
      return await this.createCartReturnDto(cart);
    } catch (e) {
      throw new BadRequestException(e.message || 'Error while loading cart');
    }
  }

  async clearCart(user: IUserFromToken) {
    try {
      const cart = await this.prisma.cart.update({
        where: { id: user.cartId },
        data: {
          productInCart: {
            deleteMany: {
              cartId: user.cartId
            }
          },
          price: 0
        },
        include: getCartInclude(user.id)
      });
      return await this.createCartReturnDto(cart);
    } catch (e) {
      throw new BadRequestException(e.message || 'Error while loading cart');
    }
  }

  private async createCartReturnDto(cart: ICartFromDb) {
    try {
      const { tax } = await this.sharedService.getFinanceSettings();
      return new CartReturnDto(cart, tax);
    } catch (e) {
      throw new BadRequestException(e.message || 'Error while loading cart');
    }
  }
}
