/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { toKstTime } from 'src/util/time.util';

export type FriendInviteHistoryDocument = FriendInviteHistory & Document;

@Schema({ timestamps: true })
export class FriendInviteHistory {
  /** 초대한 사용자 ID */
  @Prop({ required: true })
  userId: string;

  /** 초대된 친구의 사용자 ID */
  @Prop({ required: true })
  invitedUserId: string;

  /** 가입 일시(초대 수락 일시) */
  @Prop({ default: () => toKstTime(new Date()) })
  joinedAt: Date;

  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const FriendInviteHistorySchema =
  SchemaFactory.createForClass(FriendInviteHistory);
