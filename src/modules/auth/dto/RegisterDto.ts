import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'user email', type: String })
  @IsEmail({}, { message: 'Wrong email value' })
  email: string;

  @ApiProperty({ description: 'user password', type: String })
  @IsString({ message: 'Password should be a string value' })
  @MinLength(8, { message: 'Password minimum length should be 8 characters' })
  password: string;

  @ApiProperty({ description: 'user name', type: String })
  @IsString({ message: 'Name should be a string value' })
  @MaxLength(32, { message: 'Name maximum length should be 32 characters' })
  name: string;
}
