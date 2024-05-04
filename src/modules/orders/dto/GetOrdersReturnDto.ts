import { ApiProperty } from '@nestjs/swagger';

import { OrderReturnDto } from './OrderReturnDto';

export class GetOrdersReturnDto {
  @ApiProperty({ description: 'Orders list', type: [OrderReturnDto] })
  orders: OrderReturnDto[];

  @ApiProperty({
    description: 'total count of orders with current filters',
    type: Number
  })
  totalCount: number;
}
