/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { toKstTime } from 'src/util/time.util';

export type RewardHistoryDocument = RewardHistory & Document;

export enum RewardHistoryStatus {
  /** 보상 성공 */
  SUCCESS = 'SUCCESS',
  /** 보상 실패 */
  FAIL = 'FAIL',
  /** 보상 대기 중 */
  PENDING = 'PENDING',
  /** 보상 취소됨 */
  CANCELLED = 'CANCELLED',
}

@Schema({ timestamps: true })
export class RewardHistory {
  /** 보상 요청한 사용자 ID */
  @Prop({ required: true })
  userId: string;

  /** 이벤트 ID */
  @Prop({ required: true })
  eventId: string;

  /** 보상 ID 목록 */
  @Prop({ required: true })
  rewardIds: string[];

  /** 보상 요청 상태 */
  @Prop({ required: true })
  status: RewardHistoryStatus;

  /** 보상 요청 일시 */
  @Prop({ default: () => toKstTime(new Date()) })
  requestDate: Date;

  /** 보상 지급일 */
  @Prop()
  rewardDate: Date;

  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const RewardHistorySchema = SchemaFactory.createForClass(RewardHistory);
