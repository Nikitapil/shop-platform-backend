import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/RegisterDto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserReturnDto } from '../dtos-global/UserReturnDto';
import * as process from 'process';
import { ACCESS_TOKEN_EXPIRE_TIME, REFRESH_TOKEN_EXPIRE_TIME } from './constants';
import { LoginDto } from './dto/LoginDto';
import { safeUserSelect } from '../db-query-options/user-options';
import { SuccessMessageDto } from '../dtos-global/SuccessMessageDto';

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
          ...safeUserSelect
        }
      });
      return await this.generateUserDataWithTokens(newUser);
    } catch (e) {
      throw new HttpException({ message: e.message || 'Registration error' }, 400);
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email }
    });
    if (!user) {
      throw new NotFoundException('Wrong email or password');
    }

    const { password, ...restUser } = user;

    const isPasswordValid = await bcrypt.compare(dto.password, password);

    if (!isPasswordValid) {
      throw new NotFoundException('Wrong email or password');
    }

    return await this.generateUserDataWithTokens(restUser);
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Unauthorized');
    }
    try {
      const user = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_SECRET
      });
      const tokenFromDb = await this.prisma.token.findFirst({
        where: {
          userId: user.id
        }
      });

      if (!user || !tokenFromDb) {
        throw new UnauthorizedException('Unauthorized');
      }

      const userFromDb = await this.prisma.user.findUnique({
        where: { id: user.id },
        select: {
          ...safeUserSelect
        }
      });

      if (!userFromDb) {
        throw new UnauthorizedException('Unauthorized');
      }

      return await this.generateUserDataWithTokens(userFromDb);
    } catch (e) {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  async logout(token: string) {
    try {
      await this.prisma.token.deleteMany({
        where: { token }
      });
      return new SuccessMessageDto();
    } catch (e) {
      throw new HttpException({ message: e.message || 'logout error' }, 400);
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
