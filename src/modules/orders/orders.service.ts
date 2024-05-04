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
import { Prisma } from '@prisma/client';

import { EUserRoles } from '../../domain/users.domain';
import { OrderStatusEnum } from './dto/OrderStatusEnum';

import { PrismaService } from '../prisma/prisma.service';
import { SharedService } from '../shared/shared.service';

import { getCartInclude } from '../cart/cart-db-options';
import { getOrderInclude } from './orders-db-options';
import { getOffset } from '../../utils/pagination';

import { OrderReturnDto } from './dto/OrderReturnDto';
import { SuccessMessageDto } from '../../dtos-global/SuccessMessageDto';
import { CartReturnDto } from '../cart/dto/CartReturnDto';
import { CreateOrderReturnDto } from './dto/CreateOrderReturnDto';

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
      const orderProducts = cart.productInCart.map((productInCart) => ({
        productId: productInCart.product.id,
        count: productInCart.count
      }));

      const financeSettings = await this.sharedService.getFinanceSettings();
      const cartDto = new CartReturnDto(cart, financeSettings);

      const order = await this.prisma.order.create({
        data: {
          userId: user.id,
          address: dto.address,
          phone: dto.phone,
          comment: dto.comment,
          productsInOrder: {
            createMany: {
              data: orderProducts
            }
          },
          price: cartDto.price,
          status: OrderStatusEnum.CREATED
        },
        include: getOrderInclude(user.id)
      });

      const emptyCart = await this.prisma.cart.update({
        where: { id: user.cartId },
        data: {
          productInCart: {
            deleteMany: {}
          }
        },
        include: getCartInclude(user.id)
      });

      return new CreateOrderReturnDto({ order, user, financeSettings, cart: emptyCart });
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
      where: { id: dto.id },
      include: getOrderInclude(user.id)
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const mappedOrder = new OrderReturnDto(order, user);

    const isCancelStatusPermissionError =
      dto.status === OrderStatusEnum.CANCELED && !mappedOrder.canCancel;
    const isInprogressStatusPermissionError =
      dto.status === OrderStatusEnum.INPROGRESS && !mappedOrder.canSetInProgress;
    const isCreatedStatusPermissionError =
      dto.status === OrderStatusEnum.CREATED && !mappedOrder.canSetCreated;
    const isClosedStatusPermissionError =
      dto.status === OrderStatusEnum.CLOSED && !mappedOrder.canSetClosed;

    if (
      isCancelStatusPermissionError ||
      isInprogressStatusPermissionError ||
      isCreatedStatusPermissionError ||
      isClosedStatusPermissionError
    ) {
      throw new NotAcceptableException('Permission denied');
    }

    if (dto.status === OrderStatusEnum.CANCELED && !dto.cancelReason) {
      throw new BadRequestException('cancel reason is required if status is canceled');
    }

    if (dto.status !== OrderStatusEnum.CANCELED && dto.cancelReason) {
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
