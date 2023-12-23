import { UserReturnDto } from '../../../dtos-global/UserReturnDto';
import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ type: UserReturnDto })
  user: UserReturnDto;

  @ApiProperty({ type: String })
  accessToken: string;
}
