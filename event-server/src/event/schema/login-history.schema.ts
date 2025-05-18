/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { toKstTime } from 'src/util/time.util';

export type LoginHistoryDocument = LoginHistory & Document;

@Schema({ timestamps: true })
export class LoginHistory {
  /** 로그인한 사용자 ID */
  @Prop({ required: true })
  userId: string;

  /** 로그인 일시 */
  @Prop({ default: () => toKstTime(new Date()) })
  loginAt: Date;

  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const LoginHistorySchema = SchemaFactory.createForClass(LoginHistory);
