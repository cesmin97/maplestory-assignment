/* eslint-disable prettier/prettier */
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SigninDto } from '../dto/signin.dto';
import { SignupDto } from '../dto/signup.dto';
import { AuthService } from '../service/auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  /**
   * 회원가입 API
   *
   * @param dto
   * @returns
   */
  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    const user = await this.authService.signup(dto);
    return {
      message: '회원가입 성공',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
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

    // 2. 쿠키에 refresh_token 설정
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
}
