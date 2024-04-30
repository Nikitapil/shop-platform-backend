import { ApiProperty } from '@nestjs/swagger';

import { UserReturnDto } from './UserReturnDto';

export class AuthResponseDto {
  @ApiProperty({ type: UserReturnDto })
  user: UserReturnDto;

  @ApiProperty({ type: String })
  accessToken: string;
}
