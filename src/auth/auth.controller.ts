import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { RegisterDto } from './dto/RegisterDto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { COOKIE_EXPIRE_TIME, REFRESH_TOKEN_NAME } from './constants';
import { AuthResponseDto } from './dto/AuthResponseDto';
import { LoginDto } from './dto/LoginDto';
import { Cookies } from '../decorators/Cookies';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private setRefreshToken(response: Response, token: string) {
    response.cookie(REFRESH_TOKEN_NAME, token, {
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
    const { refreshToken, user, accessToken } = await this.authService.register(dto);

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
  ): Promise<AuthResponseDto> {
    const { refreshToken, user, accessToken } = await this.authService.login(dto);

    this.setRefreshToken(response, refreshToken);
    return {
      user,
      accessToken
    };
  }

  @ApiOperation({ summary: 'auth refresh data' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  @Get('/refresh')
  async refresh(
    @Cookies(REFRESH_TOKEN_NAME) token: string,
    @Res({ passthrough: true }) response: Response
  ): Promise<AuthResponseDto> {
    const { refreshToken, user, accessToken } = await this.authService.refresh(token);

    this.setRefreshToken(response, refreshToken);
    return {
      user,
      accessToken
    };
  }

  @Post('/logout')
  async logout(
    @Cookies(REFRESH_TOKEN_NAME) token: string,
    @Res({ passthrough: true }) res: Response
  ) {
    res.clearCookie(REFRESH_TOKEN_NAME);
    return await this.authService.logout(token);
  }
}
