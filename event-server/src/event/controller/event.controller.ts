/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateEventDto } from '../dto/create-event.dto';
import { EventConditionResponseDto } from '../dto/event-condition-response.dto';
import { EventDetailResponseDto } from '../dto/event-detail-response.dto';
import { EventListResponseDto } from '../dto/event-list-response.dto';
import { EventListFilter } from '../dto/event-list.filter';
import { EventService } from '../service/event.service';

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
    const event: EventDetailResponseDto =
      await this.eventService.createEvent(dto);

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
    const events: EventListResponseDto[] =
      await this.eventService.findEvents(filter);

    return {
      message: '이벤트 목록 조회 성공',
      events,
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
    const event: EventDetailResponseDto =
      await this.eventService.findEventById(eventId);

    return {
      message: '이벤트 조회 성공',
      event,
    };
  }

  /**
   * 이벤트 ID 기반 조건 목록 조회 API
   *
   * @param eventId
   * @returns
   */
  @Get(':eventId/conditions')
  async getConditionsByEventId(@Param('eventId') eventId: string) {
    const conditions: EventConditionResponseDto[] =
      await this.eventService.findConditionsByEventId(eventId);

    return {
      message: '이벤트 조건 목록 조회 성공',
      conditions,
    };
  }
}
