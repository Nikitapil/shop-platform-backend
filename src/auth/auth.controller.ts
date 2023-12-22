import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res
} from '@nestjs/common';
import { RegisterDto } from './dto/RegisterDto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { COOKIE_EXPIRE_TIME } from './constants';
import { AuthResponseDto } from './dto/AuthResponseDto';
import { LoginDto } from './dto/LoginDto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private setRefreshToken(response: Response, token: string) {
    response.cookie('shopper-token', token, {
      maxAge: COOKIE_EXPIRE_TIME,
      httpOnly: true,
      sameSite: 'none',
      secure: true
    });
  }

  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  @Post('/register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<AuthResponseDto> {
    const { refreshToken, user, accessToken } = await this.authService.register(
      dto
    );

    this.setRefreshToken(response, refreshToken);
    return {
      user,
      accessToken
    };
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const { refreshToken, user, accessToken } = await this.authService.login(
      dto
    );

    this.setRefreshToken(response, refreshToken);
    return {
      user,
      accessToken
    };
  }
}
