/* eslint-disable prettier/prettier */
import { Event, EventStatus } from '../schema/event.schema';
import { EventConditionResponseDto } from './event-condition-response.dto';
import { RewardResponseDto } from './reward-response.dto';

export class EventDetailResponseDto {
  id: string;

  name: string;

  description: string;

  status: EventStatus;

  startDate: Date;

  endDate: Date;

  createdAt: Date;

  conditions: EventConditionResponseDto[];

  rewards: RewardResponseDto[];

  constructor(
    event: Event,
    conditions: EventConditionResponseDto[],
    rewards: RewardResponseDto[],
  ) {
    this.id = event._id;
    this.name = event.name;
    this.description = event.description;
    this.status = event.status;
    this.startDate = event.startDate;
    this.endDate = event.endDate;
    this.createdAt = event.createdAt;
    this.conditions = conditions;
    this.rewards = rewards;
  }
}
