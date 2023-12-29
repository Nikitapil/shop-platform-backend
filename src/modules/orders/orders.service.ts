import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ICreateOrderParams, IGetOrdersParams } from './types';
import { PrismaService } from '../prisma/prisma.service';
import { getCartInclude } from '../../db-query-options/cart-options';
import { EOrderStatuses } from '../../domain/orders';
import { getOrderInclude } from '../../db-query-options/orders-options';
import { CreateOrderReturnDto } from '../../dtos-global/CreateOrderReturnDto';
import { EUserRoles } from '../../domain/users';
import { Prisma } from '@prisma/client';
import { getOffset } from '../../utils/pagination';
import { OrderReturnDto } from '../../dtos-global/OrderReturnDto';

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

  async getOrders({ dto, user }: IGetOrdersParams) {
    try {
      const where: Prisma.OrderWhereInput = {};
      if (!user.roles.includes(EUserRoles.ADMIN)) {
        where.userId = user.id;
      }

      if (dto.status) {
        where.status = dto.status;
      }

      const offset = getOffset(dto.page, dto.limit);

      const orders = await this.prisma.order.findMany({
        where,
        take: dto.limit,
        skip: offset,
        orderBy: {
          [dto.order || 'createdAt']: 'asc'
        },
        include: getOrderInclude(user.id)
      });

      const totalCount = await this.prisma.order.count({
        where
      });

      return { orders: orders.map((order) => new OrderReturnDto(order)), totalCount };
    } catch (e) {
      throw new BadRequestException('Error while getting orders');
    }
  }
}
