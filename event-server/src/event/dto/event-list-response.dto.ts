/* eslint-disable prettier/prettier */
import { Event, EventStatus } from '../schema/event.schema';

export class EventListResponseDto {
  id: string;

  name: string;

  description: string;

  status: EventStatus;

  startDate: Date;

  endDate: Date;

  createdAt: Date;

  constructor(event: Event) {
    this.id = event._id;
    this.name = event.name;
    this.description = event.description;
    this.status = event.status;
    this.startDate = event.startDate;
    this.endDate = event.endDate;
    this.createdAt = event.createdAt;
  }
}
