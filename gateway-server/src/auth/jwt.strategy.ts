/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtToken, JwtTokenDocument } from './schema/jwt-token.schema';

export interface AuthUserPayload {
  userId: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(JwtToken.name) private jwtTokenModel: Model<JwtTokenDocument>,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
      passReqToCallback: true,
    });
  }

  /**
   * 인증 완료 된 JWT를 전달 받아 req.user에 할당해주는 함수
   * 인증 관련 커스텀 로직 이 함수 내에 구현 가능
   *
   * @param payload
   * @returns
   */
  async validate(req: Request, payload: any) {
    const accessToken = req.headers.authorization?.replace('Bearer ', '');

    const jwtToken = await this.jwtTokenModel.findOne({ userId: payload.sub });
    if (!jwtToken || accessToken != jwtToken.accessToken) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
