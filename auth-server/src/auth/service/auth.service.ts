/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/service/user.service';
import { comparePassword } from 'src/util/password.util';
import { User, UserDocument, UserRole } from '../../user/schema/user.schema';
import { RevokeTokenDto } from '../dto/revoke-token.dto';
import { SigninDto } from '../dto/signin.dto';
import { SignupResponseDto } from '../dto/signup-response.dto';
import { SignupDto } from '../dto/signup.dto';
import {
  FriendInviteHistory,
  FriendInviteHistoryDocument,
} from '../schema/friend-invite-history.schema';
import { JwtToken, JwtTokenDocument } from '../schema/jwt-token.schema';
import {
  LoginHistory,
  LoginHistoryDocument,
} from '../schema/login-history.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(JwtToken.name) private jwtTokenModel: Model<JwtTokenDocument>,
    @InjectModel(LoginHistory.name)
    private loginHistoryModel: Model<LoginHistoryDocument>,
    @InjectModel(FriendInviteHistory.name)
    private friendInviteHistoryModel: Model<FriendInviteHistoryDocument>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  /**
   * 회원가입
   * email, password, role을 입력 받아 회원가입
   * 가입하려는 email이 이미 존재하는지 검증
   *
   * @param dto
   * @returns
   */
  async signup(dto: SignupDto): Promise<SignupResponseDto> {
    const { email, password, name, invitedBy } = dto;

    /** 1. 중복 사용자 검증 */
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    /** 2. 사용자 생성 */
    const createUserDto = new CreateUserDto({
      email,
      password,
      name,
      role: UserRole.USER,
    });
    const createdUser = await this.userService.createUser(createUserDto);

    /** 3. 초대 이력 생성
     * invitedBy(초대한 사용자 ID)에 해당하는 사용자 존재 시 friendInviteHistoryModel 생성
     */
    if (invitedBy) {
      const inviter = await this.userService.findUserById(invitedBy);
      if (inviter) {
        const newFriendInviteHistory = new this.friendInviteHistoryModel({
          userId: invitedBy,
          invitedUserId: createdUser._id,
        });
        await newFriendInviteHistory.save();
      }
    }

    /** 4. responseDto 생성 및 return */
    const responseDto: SignupResponseDto = new SignupResponseDto(createdUser);

    return responseDto;
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
    const isPasswordValid = await comparePassword(password, user.password);
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
    const accessTokenPayload = {
      email: user.email,
      sub: user._id,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(accessTokenPayload, {
      expiresIn: accessTokenExpiresIn,
    });
    const refreshTokenPayload = { sub: user._id };
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: refreshTokenExpiresIn,
    });

    /** 5. DB에 토큰 저장 */
    const newJwtToken = new this.jwtTokenModel({
      userId: user._id,
      accessToken,
      refreshToken,
    });
    await newJwtToken.save();

    /** 6. 로그인 이력 저장 */
    const newLoginHistory = new this.loginHistoryModel({
      userId: user._id,
    });
    await newLoginHistory.save();

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * 사용자 이메일(username) 기반 접속정보(토큰) 삭제
   * 사용자 존재 여부 검증
   * 토큰 존재 여부 검증
   *
   * @param dto
   */
  async revokeToken(dto: RevokeTokenDto) {
    const { email } = dto;

    /** 1. 이메일 확인 */
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException(
        '해당 이메일을 가진 사용자를 찾을 수 없습니다.',
      );
    }

    /** 2. 발급 된 토큰 존재 여부 확인 */
    const jwtToken = await this.jwtTokenModel.findOne({ userId: user._id });
    if (!jwtToken) {
      throw new NotFoundException(
        '해당 사용자의 접속 정보를 찾을 수 없습니다.',
      );
    }

    /** 3. 토큰 삭제 */
    await this.jwtTokenModel.deleteOne({ userId: user._id });
  }
}
