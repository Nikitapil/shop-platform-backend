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
import { UserReturnDto } from '../../dtos-global/UserReturnDto';
import * as process from 'process';
import { ACCESS_TOKEN_EXPIRE_TIME, REFRESH_TOKEN_EXPIRE_TIME } from './constants';
import { LoginDto } from './dto/LoginDto';
import { safeUserSelect } from './user-db-options';
import { SuccessMessageDto } from '../../dtos-global/SuccessMessageDto';
import { EUserRoles, IUserFromToken } from '../../domain/users.domain';
import { IChangePasswordParams, IUpdateUserDataParams } from './types';

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
          password,
          cart: {
            create: {}
          }
        },
        select: {
          ...safeUserSelect
        }
      });
      return await this.generateUserDataWithTokens(newUser);
    } catch (e: any) {
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
    } catch (e: any) {
      throw new HttpException({ message: e.message || 'logout error' }, 400);
    }
  }

  async updateUserData({ dto, user }: IUpdateUserDataParams) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          ...dto
        },
        select: { ...safeUserSelect }
      });

      return await this.generateUserDataWithTokens(updatedUser);
    } catch (e: any) {
      throw new HttpException({ message: e.message || 'update user error' }, 400);
    }
  }

  async changePassword({ dto, user }: IChangePasswordParams) {
    try {
      const { password } = await this.prisma.user.findUnique({
        where: { id: user.id },
        select: {
          password: true
        }
      });

      const isPasswordValid = await bcrypt.compare(dto.oldPassword, password);

      if (!isPasswordValid) {
        throw new HttpException({ message: 'Wrong password' }, 400);
      }

      const updatedPassword = await bcrypt.hash(dto.newPassword, 5);

      const updatedUser = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          password: updatedPassword
        },
        select: { ...safeUserSelect }
      });

      return await this.generateUserDataWithTokens(updatedUser);
    } catch (e: any) {
      throw new HttpException({ message: e.message || 'change password error' }, 400);
    }
  }

  private createTokenPayload(user: UserReturnDto): IUserFromToken {
    return {
      id: user.id,
      email: user.email,
      roles: user.roles as EUserRoles[],
      cartId: user.cartId
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
    } catch (e: any) {
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
