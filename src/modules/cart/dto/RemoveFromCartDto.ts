import { IsString } from 'class-validator';

export class RemoveFromCartDto {
  @IsString()
  productInCartId: string;
}
