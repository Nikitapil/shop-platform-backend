import { ApiProperty } from '@nestjs/swagger';
import {IsString, ValidateIf} from 'class-validator';

export class EditProductDiscountDto {
  @ApiProperty({ description: 'discount id', type: String, nullable: true })
  @IsString()
  @ValidateIf((object, value) => value !== null)
  discountId: string | null;

  @ApiProperty({ description: 'product id', type: String })
  @IsString()
  productId?: string;
}
