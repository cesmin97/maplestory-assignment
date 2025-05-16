/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { User, UserDocument } from '../schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * 사용자 권한 부여
   * 관리자만 권한 부여 가능
   *
   * @param dto
   */
  async updateRole(dto: UpdateRoleDto) {
    // 1. 사용자 검증
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2. 역할 업데이트
    user.role = dto.role;
    await user.save();
  }
}
