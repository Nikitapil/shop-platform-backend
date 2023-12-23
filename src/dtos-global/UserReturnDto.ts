import { ApiProperty } from '@nestjs/swagger';

export class UserReturnDto {
  @ApiProperty({ description: 'user id', type: String })
  id: string;

  @ApiProperty({ description: 'user email', type: String })
  email: string;

  @ApiProperty({ description: 'user name', type: String })
  name: string;

  @ApiProperty({ description: 'user role', type: ['ADMIN', 'USER'] })
  @ApiProperty()
  roles: string[];
}
