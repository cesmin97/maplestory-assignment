/* eslint-disable prettier/prettier */
import { EventConditionType } from '../schema/event-condition.schema';
import { EventStatus } from '../schema/event.schema';

export class EventConditionResponseDto {
  type: EventConditionType;

  value: number;

  description: string;

  isActivate: boolean;
}

export class EventResponseDto {
  id: string;

  name: string;

  description: string;

  status: EventStatus;

  startDate: Date;

  endDate: Date;

  createdAt: Date;

  conditions: EventConditionResponseDto[];
}
