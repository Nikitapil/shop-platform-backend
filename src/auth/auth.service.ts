import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/RegisterDto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserReturnDto } from '../dtos-global/UserReturnDto';
import * as process from 'process';
import {
  ACCESS_TOKEN_EXPIRE_TIME,
  REFRESH_TOKEN_EXPIRE_TIME
} from './constants';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    const candidate = await this.prisma.user.findUnique({
      where: { email: dto.email }
    });

    if (candidate) {
      throw new ForbiddenException('User already exist');
    }

    const password = await bcrypt.hash(dto.password, 5);

    try {
      const newUser = await this.prisma.user.create({
        data: {
          ...dto,
          password
        },
        select: {
          id: true,
          email: true,
          name: true
        }
      });
      return await this.generateUserDataWithTokens(newUser);
    } catch (e) {
      throw new HttpException(
        { message: e.message || 'Registration error' },
        400
      );
    }
  }

  private createTokenPayload(user: UserReturnDto) {
    return {
      id: user.id,
      email: user.email
    };
  }

  private async updateRefreshToken(user: UserReturnDto) {
    const refreshToken = this.jwtService.sign(this.createTokenPayload(user), {
      secret: process.env.REFRESH_SECRET,
      expiresIn: REFRESH_TOKEN_EXPIRE_TIME
    });

    try {
      const token = await this.prisma.token.findFirst({
        where: { userId: user.id }
      });

      await this.prisma.token.upsert({
        where: { id: token?.id || '' },
        create: {
          userId: user.id,
          token: refreshToken
        },
        update: {
          token: refreshToken
        }
      });
      return refreshToken;
    } catch (e) {
      throw new HttpException(
        { message: e.message || 'Error while creating token' },
        400
      );
    }
  }

  private async generateUserDataWithTokens(user: UserReturnDto) {
    const accessToken = this.jwtService.sign(this.createTokenPayload(user), {
      secret: process.env.ACCESS_SECRET,
      expiresIn: ACCESS_TOKEN_EXPIRE_TIME
    });

    const refreshToken = await this.updateRefreshToken(user);

    return { user, accessToken, refreshToken };
  }
}
