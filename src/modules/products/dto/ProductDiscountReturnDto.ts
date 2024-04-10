import { ApiProperty } from '@nestjs/swagger';

export class ProductDiscountReturnDto {
  @ApiProperty({ description: 'discount id', type: String })
  id: string;

  @ApiProperty({ description: 'discount name', type: String })
  name: string;

  @ApiProperty({ description: 'discount name', type: String })
  percentage: number;
}
