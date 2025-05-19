/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  USER = 'USER',
  OPERATOR = 'OPERATOR',
  AUDITOR = 'AUDITOR',
  ADMIN = 'ADMIN',
}

@Schema({ timestamps: true })
export class User {
  /** 이메일(username) */
  @Prop({ required: true, unique: true })
  email: string;

  /** 비밀번호 */
  @Prop({ required: true })
  password: string;

  /** 이름 */
  @Prop({ required: true })
  name: string;

  /** 권한 */
  @Prop({ enum: UserRole, default: UserRole.USER })
  role: UserRole;

  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
