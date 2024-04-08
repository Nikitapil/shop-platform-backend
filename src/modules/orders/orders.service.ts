import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException
} from '@nestjs/common';
import {
  ICreateOrderParams,
  IGetOrdersParams,
  IGetSingleOrderParams,
  IUpdateOrderStatusParams
} from './types';
import { PrismaService } from '../prisma/prisma.service';
import { getCartInclude } from '../../db-query-options/cart-options';
import { EOrderStatuses } from '../../domain/orders';
import { getOrderInclude } from '../../db-query-options/orders-options';
import { CreateOrderReturnDto } from '../../dtos-global/CreateOrderReturnDto';
import { EUserRoles } from '../../domain/users';
import { Prisma } from '@prisma/client';
import { getOffset } from '../../utils/pagination';
import { OrderReturnDto } from '../../dtos-global/OrderReturnDto';
import { SuccessMessageDto } from '../../dtos-global/SuccessMessageDto';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService, private sharedService: SharedService) {}

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
      const { tax } = await this.sharedService.getFinanceSettings();
      return new CreateOrderReturnDto({ order, user, tax, cart: emptyCart });
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

      return {
        orders: orders.map((order) => new OrderReturnDto(order, user)),
        totalCount
      };
    } catch (e) {
      throw new BadRequestException('Error while getting orders');
    }
  }

  async updateOrderStatus({ dto, user }: IUpdateOrderStatusParams) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.id }
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== user.id && !user.roles.includes(EUserRoles.ADMIN)) {
      throw new NotAcceptableException('Permission denied');
    }

    if (dto.status === EOrderStatuses.CANCELED && !dto.cancelReason) {
      throw new BadRequestException('cancel reason is required if status is canceled');
    }

    if (dto.status !== EOrderStatuses.CANCELED && dto.cancelReason) {
      throw new BadRequestException(
        'cancel reason is not allowed when status is not canceled'
      );
    }

    try {
      await this.prisma.order.update({
        where: { id: dto.id },
        data: {
          status: dto.status,
          cancelReason: dto.cancelReason || null
        }
      });
      return new SuccessMessageDto();
    } catch (e) {
      throw new BadRequestException('Error while getting orders');
    }
  }

  async getSingleOrder({ orderId, user }: IGetSingleOrderParams) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: getOrderInclude(user.id)
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== user.id && !user.roles.includes(EUserRoles.ADMIN)) {
      throw new NotAcceptableException('Permission denied');
    }

    return new OrderReturnDto(order, user);
  }
}
