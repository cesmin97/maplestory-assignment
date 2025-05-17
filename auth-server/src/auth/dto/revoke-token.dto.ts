/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RevokeTokenDto {
  @IsEmail()
  @IsNotEmpty({ message: '삭제 대상 사용자 이메일은 필수입니다.' })
  email: string;
}
