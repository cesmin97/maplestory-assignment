/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventConditionDocument = EventCondition & Document;

export enum EventConditionType {
  /** 연속 로그인 */
  LOGIN_STREAK = 'LOGIN_STREAK',
  /** 친구 초대 */
  FRIEND_INVITE = 'FRIEND_INVITE',
}

@Schema({ timestamps: true })
export class EventCondition {
  /** 조건 유형 */
  @Prop({ enum: EventConditionType })
  type: EventConditionType;

  /** 조건 값 (예: 연속 로그인 일수, 초대 친구 수) */
  @Prop({ required: true })
  value: number;

  /** 조건 설명 */
  @Prop({ required: true })
  description: string;

  /** 연결된 이벤트 ID */
  @Prop({ required: true })
  eventId: string;

  /** 조건 활성화 여부 */
  @Prop({ default: true })
  isActivate: boolean;

  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const EventConditionSchema =
  SchemaFactory.createForClass(EventCondition);
