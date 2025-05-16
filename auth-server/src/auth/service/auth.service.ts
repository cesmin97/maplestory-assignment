/* eslint-disable prettier/prettier */
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../user/schema/user.schema';
import { SigninDto } from '../dto/signin.dto';
import { SignupDto } from '../dto/signup.dto';
import { JwtToken, JwtTokenDocument } from '../schema/jwt-token.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(JwtToken.name) private jwtTokenModel: Model<JwtTokenDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * 회원가입
   * email, password, role을 입력 받아 회원가입
   * 가입하려는 email이 이미 존재하는지 검증
   *
   * @param dto
   * @returns
   */
  async signup(dto: SignupDto): Promise<User> {
    const { email, password, role } = dto;

    /** 1. 중복 사용자 검증 */
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    /** 2. 사용자 생성 */
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      role,
    });
    return newUser.save();
  }

  /**
   * 로그인
   * email, password로 로그인
   * 성공 시 accessToken 및 refreshToken 발급(DB로 상태 관리)
   * accessToken은 body에 refreshToken은 HttpOnly Cookie에 응답
   *
   * @param dto
   * @returns
   */
  async signin(dto: SigninDto) {
    const { email, password } = dto;

    /** 1. 이메일 확인 */
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');
    }

    /** 2. 비밀번호 검증 */
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');
    }

    /** 3. 기존 발급 된 토큰 삭제 */
    await this.jwtTokenModel.deleteMany({ userId: user._id });

    /** 4. 토큰 발급 */
    const accessTokenExpiresIn = this.configService.get<number>(
      'ACCESS_TOKEN_EXPIRES_IN',
    );
    const refreshTokenExpiresIn = this.configService.get<number>(
      'REFRESH_TOKEN_EXPIRES_IN',
    );
    const payload = { email: user.email, sub: user._id };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: accessTokenExpiresIn,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: refreshTokenExpiresIn,
    });

    /** 5. DB에 토큰 저장 */
    const newJwtToken = new this.jwtTokenModel({
      userId: user._id.toString(),
      accessToken,
      refreshToken,
    });
    await newJwtToken.save();

    return {
      accessToken,
      refreshToken,
    };
  }
}
