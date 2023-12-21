import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dto/RegisterDto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Register user' })
  // TODO add api response DTO
  // @ApiResponse({ status: 201, type: ReturnGeneratedQuizDto })
  @Post('/register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
}
