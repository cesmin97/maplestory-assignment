/* eslint-disable prettier/prettier */
import { User } from 'src/user/schema/user.schema';
import { toKstTime } from 'src/util/time.util';

/* eslint-disable prettier/prettier */
export class SignupResponseDto {
  id: string;

  email: string;

  role: string;

  createdAt: Date;

  constructor(user: User) {
    this.id = user._id;
    this.email = user.email;
    this.role = user.role;
    this.createdAt = toKstTime(user.createdAt);
  }
}
