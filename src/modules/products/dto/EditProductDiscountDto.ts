import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class EditProductDiscountDto {
  @ApiProperty({ description: 'discount id', type: String, nullable: true })
  @IsString()
  discountId: string | null;

  @ApiProperty({ description: 'product id', type: String })
  @IsOptional()
  productId?: string;
}
