/* eslint-disable prettier/prettier */
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../schema/user.schema';

export class UpdateRoleDto {
  @IsEmail()
  @IsNotEmpty({ message: '사용자 이메일은 필수입니다.' })
  email: string;

  @IsEnum(UserRole, { message: '유효하지 않은 역할입니다.' })
  @IsNotEmpty({ message: '역할은 필수입니다.' })
  role: UserRole;
}
