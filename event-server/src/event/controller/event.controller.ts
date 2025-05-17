/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { EventService } from '../service/event.service';
import { CreateEventDto } from '../dto/create-event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  /**
   * 이벤트 생성 API
   * 관리자, 운영자만 접근 가능
   *
   * @param dto
   * @returns
   */
  @Post()
  async createEvent(@Body() dto: CreateEventDto) {
    const event = await this.eventService.createEvent(dto);
    return {
      message: '이벤트 생성 성공',
      event,
    };
  }
}
