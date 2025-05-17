/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateEventDto } from '../dto/create-event.dto';
import { EventService } from '../service/event.service';
import { EventListFilter } from '../dto/event-list.filter';

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

  /**
   * 이벤트 목록 조회 API
   *
   * @param filter
   * @returns
   */
  @Get()
  async getEvents(@Query() filter: EventListFilter) {
    const responseDtos = await this.eventService.findEvents(filter);
    return {
      message: '이벤트 목록 조회 성공',
      responseDtos,
    };
  }

  /**
   * 이벤트 상세 조회 API
   *
   * @param eventId
   * @returns
   */
  @Get(':eventId')
  async getEventById(@Param('eventId') eventId: string) {
    const responseDto = await this.eventService.findEventById(eventId);
    return {
      message: '이벤트 조회 성공',
      responseDto,
    };
  }
}
