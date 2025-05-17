/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  /**
   * 인증 완료 된 JWT를 전달 받아 req.user에 할당해주는 함수
   * 인증 관련 커스텀 로직 이 함수 내에 구현 가능
   *
   * @param payload
   * @returns
   */
  async validate(payload: any) {
    console.log('JwtStrategy: payload:', payload);
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
