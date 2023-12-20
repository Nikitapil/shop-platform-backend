import {IsString, Length} from "class-validator";

export class RegisterDto {
  @IsString({ message: 'Username should be a string' })
  @Length(2, 16, {message: 'username length should be from 2 to 16 characters'})
  username: string
}