import { Body, Controller, Post, Res } from '@nestjs/common';
import { RegisterDto } from './dto/RegisterDto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { COOKIE_EXPIRE_TIME } from './constants';
import { RegisterReturnDto } from './dto/RegisterReturnDto';

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
  @ApiResponse({ status: 201, type: RegisterDto })
  @Post('/register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<RegisterReturnDto> {
    const { refreshToken, user, accessToken } = await this.authService.register(
      dto
    );

    this.setRefreshToken(response, refreshToken);
    return {
      user,
      accessToken
    };
  }
}
