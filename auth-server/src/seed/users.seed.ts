/* eslint-disable prettier/prettier */

import { UserRole } from 'src/user/schema/user.schema';

export const initialUsers = [
  {
    email: 'admin@nexon.com',
    password: 'securepassword',
    name: 'admin',
    role: UserRole.ADMIN,
  },
  {
    email: 'auditor@nexon.com',
    password: 'securepassword',
    name: 'auditor',
    role: UserRole.AUDITOR,
  },
  {
    email: 'operator@nexon.com',
    password: 'securepassword',
    name: 'operator',
    role: UserRole.OPERATOR,
  },
  {
    email: 'user1@nexon.com',
    password: 'securepassword',
    name: 'user1',
    role: UserRole.USER,
  },
  {
    email: 'user2@nexon.com',
    password: 'securepassword',
    name: 'user2',
    role: UserRole.USER,
  },
  {
    email: 'user3@nexon.com',
    password: 'securepassword',
    name: 'user3',
    role: UserRole.USER,
  },
];
