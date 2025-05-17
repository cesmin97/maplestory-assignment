/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

export enum EventStatus {
  /** 이벤트가 활성화 된 상태 */
  ACTIVATE = 'ACTIVATE',
  /** 이벤트가 비활성화 된 상태 */
  INACTIVATE = 'INACTIVATE',
  /** 이벤트가 완료 된 상태 */
  COMPLEATED = 'COMPLEATED',
  /** 이벤트가 대기 중인 상태 */
  PENDING = 'PENDING',
  /** 이벤트가 중지 된 상태 */
  PAUSED = 'PAUSED',
  /** 이벤트가 취소 된 상태 */
  CANCELLED = 'CANCELLED',
}

@Schema({ timestamps: true })
export class Event {
  /** 이벤트 명 */
  @Prop({ required: true })
  name: string;

  /** 이벤트 설명 */
  @Prop({ required: true })
  description: string;

  /** 이벤트 상태 */
  @Prop({ enum: EventStatus, default: EventStatus.ACTIVATE })
  status: EventStatus;

  /** 이벤트 시작일 */
  @Prop({ required: true })
  startDate: Date;

  /** 이벤트 종료일 */
  @Prop({ required: true })
  endDate: Date;

  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
