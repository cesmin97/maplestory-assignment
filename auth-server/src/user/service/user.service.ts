/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hashPassword } from 'src/util/password.util';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User, UserDocument, UserRole } from '../schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * 사용자 생성
   *
   * @param dto
   * @returns
   */
  async createUser(dto: CreateUserDto): Promise<User> {
    const { email, password, name, role } = dto;

    /** 1. 중복 사용자 검증 */
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    /** 2. 사용자 생성 */
    const hashedPassword = await hashPassword(password);
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      name,
      role: role ? role : UserRole.USER,
    });
    return await newUser.save();
  }

  /**
   * 사용자 목록 조회
   *
   * @param id
   */
  async findUsers() {
    const users = await this.userModel.find();

    return users;
  }

  /**
   * 사용자 ID 기반 사용자 조회
   *
   * @param id
   */
  async findUserById(id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: id });

    return user;
  }

  /**
   * 사용자 정보 변경
   *
   * @param dto
   */
  async updateUser(dto: UpdateUserDto) {
    const { password, name, role } = dto;

    /** 1. 사용자 검증 */
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    /** 3. 사용자 업데이트 */
    if (password) {
      user.password = await hashPassword(password);
    }
    user.name = name;
    user.role = role;
    return await user.save();
  }

  /**
   * 사용자 권한 부여
   *
   * @param dto
   */
  async updateRole(dto: UpdateRoleDto) {
    const { email, role } = dto;

    /** 1. 사용자 검증 */
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    /** 2. DB 부하를 최소화하기 위해 현재 같은 권한을 보유 중이면 그대로 return */
    if (user.role == role) {
      return user;
    }

    /** 3. 권한 업데이트 */
    user.role = role;
    return await user.save();
  }
}
