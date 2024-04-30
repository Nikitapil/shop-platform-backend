import { ApiProperty } from '@nestjs/swagger';

import { IsString, MinLength } from 'class-validator';
import { Match } from '../../../decorators/validation/Match.decorator';

export class ChangePasswordDto {
  @ApiProperty({ description: 'user old password', type: String })
  @IsString({ message: 'Old Password should be a string value' })
  oldPassword: string;

  @ApiProperty({ description: 'user new password', type: String })
  @IsString({ message: 'New Password should be a string value' })
  @MinLength(8, { message: 'Password minimum length should be 8 characters' })
  newPassword: string;

  @ApiProperty({ description: 'user confirm password', type: String })
  @Match('newPassword', { message: 'Passwords are not matched' })
  confirmPassword: string;
}
