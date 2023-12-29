import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ICreateOrderParams } from './types';
import { PrismaService } from '../prisma/prisma.service';
import { getCartInclude } from '../../db-query-options/cart-options';
import { EOrderStatuses } from '../../domain/orders';
import { getOrderInclude } from '../../db-query-options/orders-options';
import { CreateOrderReturnDto } from '../../dtos-global/CreateOrderReturnDto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder({ dto, user }: ICreateOrderParams) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: user.cartId },
      include: getCartInclude(user.id)
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    if (!cart.productInCart.length) {
      throw new BadRequestException('Cart is empty');
    }

    try {
      const productsIds = cart.productInCart.map((productInCart) => ({
        productId: productInCart.product.id,
        count: productInCart.count
      }));
      const order = await this.prisma.order.create({
        data: {
          userId: user.id,
          address: dto.address,
          phone: dto.phone,
          comment: dto.comment,
          productsInOrder: {
            createMany: {
              data: productsIds
            }
          },
          price: cart.price,
          status: EOrderStatuses.CREATED
        },
        include: getOrderInclude(user.id)
      });
      const emptyCart = await this.prisma.cart.update({
        where: { id: user.cartId },
        data: {
          productInCart: {
            deleteMany: {}
          },
          price: 0
        },
        include: getCartInclude(user.id)
      });

      return new CreateOrderReturnDto(order, emptyCart);
    } catch (e) {
      throw new BadRequestException('Error while creating an order');
    }
  }
}
