/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { RevokeTokenDto } from '../dto/revoke-token.dto';
import { SigninDto } from '../dto/signin.dto';
import { SignupResponseDto } from '../dto/signup-response.dto';
import { SignupDto } from '../dto/signup.dto';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  /**
   * 회원가입 API
   *
   * @param dto
   * @returns
   */
  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    const user: SignupResponseDto = await this.authService.signup(dto);
    return {
      message: '회원가입 성공',
      user,
    };
  }

  /**
   * 로그인 API
   *
   * @param res
   * @param dto
   */
  @Post('signin')
  async signin(@Res() res: Response, @Body() dto: SigninDto) {
    const jwtToken = await this.authService.signin(dto);

    /** 1. 쿠키에 refresh-token 설정 */
    const refreshTokenExpiresIn = this.configService.get<number>(
      'REFRESH_TOKEN_EXPIRES_IN',
    );
    res.cookie('refresh-token', jwtToken.refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: refreshTokenExpiresIn,
    });
    res.status(HttpStatus.OK).json({
      message: '로그인 성공',
      accessToken: jwtToken.accessToken,
    });
  }

  /**
   * 액세스 토큰 재발급 API
   *
   * @param res
   * @param dto
   */
  @Post('reissue')
  async reissue(@Req() req: Request) {
    const reissuedToken = await this.authService.reissue(req);

    return {
      message: '토큰이 재발급 됐습니다.',
      accessToken: reissuedToken,
    };
  }

  /**
   * 접속 정보(토큰) 삭제 API
   * 관리자만 접근 가능
   *
   * @param dto
   * @returns
   */
  @Delete('revoke-token')
  async revokeToken(@Body() dto: RevokeTokenDto) {
    await this.authService.revokeToken(dto);
    return {
      message: `${dto.email} 의 접속 정보가 삭제되었습니다.`,
    };
  }
}
