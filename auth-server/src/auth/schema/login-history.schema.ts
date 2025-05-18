/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LoginHistoryDocument = LoginHistory & Document;

@Schema({ timestamps: true })
export class LoginHistory {
  /** 로그인한 사용자 ID */
  @Prop({ required: true })
  userId: string;

  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const LoginHistorySchema = SchemaFactory.createForClass(LoginHistory);
