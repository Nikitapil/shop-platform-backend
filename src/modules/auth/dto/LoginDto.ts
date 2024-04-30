import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'user email', type: String })
  @IsEmail({}, { message: 'Wrong email value' })
  email: string;

  @ApiProperty({ description: 'user password', type: String })
  @IsString({ message: 'Password should be a string value' })
  password: string;
}
