import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ description: 'user address', type: String })
  @IsString()
  address: string;

  @ApiProperty({ description: 'user phone', type: String })
  @IsString()
  phone: string;

  @ApiPropertyOptional({ description: 'order comment', type: String })
  @IsString()
  @IsOptional()
  comment?: string;
}
