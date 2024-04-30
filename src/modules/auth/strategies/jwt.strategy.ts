import process from 'process';
import { PrismaService } from '../../prisma/prisma.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserReturnDto } from '../dto/UserReturnDto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_SECRET
    });
  }

  async validate(payload: UserReturnDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.id
      }
    });
    if (user) {
      return payload;
    }
    return user;
  }
}
