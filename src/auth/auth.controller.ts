import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dto/RegisterDto';

@Controller('auth')
export class AuthController {
  @Post('/register')
  register(@Body() dto: RegisterDto) {
    return dto;
  }
}
