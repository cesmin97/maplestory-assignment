/* eslint-disable prettier/prettier */
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../schema/user.schema';

export class UpdateUserDto {
  @IsEmail()
  @IsNotEmpty({ message: '사용자 이메일은 필수입니다.' })
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' })
  password?: string;

  @IsString()
  @IsNotEmpty({ message: '이름은 필수입니다.' })
  name: string;

  @IsEnum(UserRole, { message: '유효하지 않은 역할입니다.' })
  @IsNotEmpty({ message: '역할은 필수입니다.' })
  role: UserRole;
}
