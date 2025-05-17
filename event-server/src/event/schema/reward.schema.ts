/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RewardDocument = Reward & Document;

export enum RewardType {
  ITEM = 'ITEM',
  POINT = 'POINT',
  COUPON = 'COUPON',
}

@Schema({ timestamps: true })
export class Reward {
  /** 보상 유형 */
  @Prop({ enum: RewardType })
  type: RewardType;

  /** 보상 명 */
  @Prop({ required: true })
  name: string;

  /** 보상 수량 */
  @Prop({ required: true })
  amount: number;

  /** 보상 설명 */
  @Prop({ required: true })
  description: string;

  /** 연결된 이벤트 ID */
  @Prop({ required: true })
  eventId: string;

  /** 보상 활성화 여부 */
  @Prop({ default: true })
  isActivate: boolean;

  /** 보상 시작일 */
  @Prop({ required: true })
  startDate: Date;

  /** 보상 종료일 */
  @Prop({ required: true })
  endDate: Date;

  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
