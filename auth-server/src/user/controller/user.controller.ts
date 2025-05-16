/* eslint-disable prettier/prettier */
import { Body, Controller, Patch } from '@nestjs/common';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { UserService } from '../service/user.service';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 사용자 권한 부여 API
   *
   * @param dto
   * @returns
   */
  @Patch('role')
  async updateRole(@Body() dto: UpdateRoleDto) {
    await this.userService.updateRole(dto);
    return {
      message: '권한이 변경되었습니다.',
    };
  }
}
