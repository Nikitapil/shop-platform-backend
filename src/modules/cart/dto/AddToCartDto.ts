import { IsString } from 'class-validator';

export class AddToCartDto {
  @IsString()
  productId: string;
}
