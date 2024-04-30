import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Res,
  UseGuards
} from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';

import { Cookies } from '../../decorators/Cookies';
import { User } from '../../decorators/User.decorator';

import { JwtGuard } from '../../guards/auth/jwt.guard';

import { Response } from 'express';
import { IUserFromToken } from '../../domain/users.domain';

import { COOKIE_EXPIRE_TIME, REFRESH_TOKEN_NAME } from './constants';

import { UpdateUserDataDto } from './dto/UpdateUserDataDto';
import { LoginDto } from './dto/LoginDto';
import { AuthResponseDto } from './dto/AuthResponseDto';
import { RegisterDto } from './dto/RegisterDto';
import { ChangePasswordDto } from './dto/ChangePasswordDto';
import { SuccessMessageDto } from '../../dtos-global/SuccessMessageDto';

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

  @ApiOperation({ summary: 'Register user', operationId: 'register' })
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

  @ApiOperation({ summary: 'Login user', operationId: 'login' })
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

  @ApiOperation({ summary: 'auth refresh data', operationId: 'refreshAuth' })
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

  @ApiOperation({ summary: 'auth logout', operationId: 'logout' })
  @ApiResponse({ status: 200, type: SuccessMessageDto })
  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  async logout(
    @Cookies(REFRESH_TOKEN_NAME) token: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<SuccessMessageDto> {
    res.clearCookie(REFRESH_TOKEN_NAME);
    return await this.authService.logout(token);
  }

  @ApiOperation({ summary: 'update user data', operationId: 'updateUserData' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  @UseGuards(JwtGuard)
  @Put()
  async updateUserData(
    @Body() dto: UpdateUserDataDto,
    @User() userFromToken: IUserFromToken,
    @Res({ passthrough: true }) response: Response
  ): Promise<AuthResponseDto> {
    const { refreshToken, user, accessToken } = await this.authService.updateUserData({
      dto,
      user: userFromToken
    });

    this.setRefreshToken(response, refreshToken);
    return {
      user,
      accessToken
    };
  }

  @ApiOperation({ summary: 'change password', operationId: 'changePassword' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  @UseGuards(JwtGuard)
  @Put('/password')
  async changePassword(
    @Body() dto: ChangePasswordDto,
    @User() userFromToken: IUserFromToken,
    @Res({ passthrough: true }) response: Response
  ): Promise<AuthResponseDto> {
    const { refreshToken, user, accessToken } = await this.authService.changePassword({
      dto,
      user: userFromToken
    });

    this.setRefreshToken(response, refreshToken);
    return {
      user,
      accessToken
    };
  }
}
