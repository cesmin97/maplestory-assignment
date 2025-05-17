/* eslint-disable prettier/prettier */
import { EventStatus } from '../schema/event.schema';

export class EventListFilter {
  name: string;

  description: string;

  status: EventStatus;

  startDate: Date;

  endDate: Date;
}
