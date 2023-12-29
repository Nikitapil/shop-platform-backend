import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ description: 'user address', type: String })
  @IsString()
  address: string;

  @ApiProperty({ description: 'user phone', type: String })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'order comment', type: String, nullable: true })
  @IsString()
  @IsOptional()
  comment?: string;
}
