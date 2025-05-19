/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JwtTokenDocument = JwtToken & Document;

@Schema({ timestamps: true })
export class JwtToken {
  /** 액세스 토큰 */
  @Prop({ required: true })
  accessToken: string;

  /** 리프레시 토큰 */
  @Prop({ required: true })
  refreshToken: string;

  /** 발급 대상 사용자 아이디 */
  @Prop({ required: true, unique: true })
  userId: string;

  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const JwtTokenSchema = SchemaFactory.createForClass(JwtToken);
