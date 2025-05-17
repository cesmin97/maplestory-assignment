/* eslint-disable prettier/prettier */
import { Body, Controller, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 사용자 생성 API
   * 관리자만 접근 가능
   *
   * @param dto
   * @returns
   */
  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    console.log(dto);
    const user = await this.userService.createUser(dto);
    return {
      message: '사용자 생성 성공',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  }

  /**
   * 사용자 권한 부여 API
   * 관리자만 접근 가능
   *
   * @param dto
   * @returns
   */
  @Patch('role')
  async updateRole(@Body() dto: UpdateRoleDto) {
    const user = await this.userService.updateRole(dto);
    return {
      message: '권한이 변경되었습니다.',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
