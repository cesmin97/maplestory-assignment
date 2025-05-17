/* eslint-disable prettier/prettier */
import {
  EventCondition,
  EventConditionType,
} from '../schema/event-condition.schema';

export class EventConditionResponseDto {
  type: EventConditionType;

  value: number;

  description: string;

  isActivate: boolean;

  constructor(condition: EventCondition) {
    this.type = condition.type;
    this.value = condition.value;
    this.description = condition.description;
    this.isActivate = condition.isActivate;
  }
}
