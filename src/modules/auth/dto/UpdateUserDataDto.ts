import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDataDto {
  @ApiProperty({ description: 'user email', type: String })
  @IsEmail({}, { message: 'Wrong email value' })
  @IsOptional()
  email: string;

  @ApiProperty({ description: 'user name', type: String })
  @IsString({ message: 'Name should be a string value' })
  @MaxLength(32, { message: 'Name maximum length should be 32 characters' })
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ description: 'user address', type: String })
  @IsString({ message: 'Address should be a string value' })
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'user phone', type: String })
  @IsString({ message: 'Phone should be a string value' })
  @IsOptional()
  phone?: string;
}
