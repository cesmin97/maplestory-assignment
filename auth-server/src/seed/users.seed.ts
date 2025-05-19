/* eslint-disable prettier/prettier */

import { UserRole } from 'src/user/schema/user.schema';

export const initialUsers = [
  {
    email: 'admin@nexon.com',
    password: 'securepassword',
    role: UserRole.ADMIN,
  },
  {
    email: 'auditor@nexon.com',
    password: 'securepassword',
    role: UserRole.AUDITOR,
  },
  {
    email: 'operator@nexon.com',
    password: 'securepassword',
    role: UserRole.OPERATOR,
  },
  {
    email: 'user1@nexon.com',
    password: 'securepassword',
    role: UserRole.USER,
  },
  {
    email: 'user2@nexon.com',
    password: 'securepassword',
    role: UserRole.USER,
  },
  {
    email: 'user3@nexon.com',
    password: 'securepassword',
    role: UserRole.USER,
  },
];
