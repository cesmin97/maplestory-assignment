/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { EventService } from '../service/event.service';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}
}
