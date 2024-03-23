import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EUserRoles } from '../domain/users';

export class UserReturnDto {
  @ApiProperty({ description: 'user id', type: String })
  id: string;

  @ApiProperty({ description: 'user email', type: String })
  email: string;

  @ApiProperty({ description: 'user name', type: String })
  name: string;

  @ApiProperty({ description: 'user role', type: [String], enum: ['ADMIN', 'USER'] })
  roles: string[];

  @ApiProperty({ description: 'user cartId', type: String })
  cartId: string;

  @ApiPropertyOptional({ description: 'user address', type: String, nullable: true })
  address?: string;

  @ApiPropertyOptional({ description: 'user phone', type: String, nullable: true })
  phone?: string;
}
