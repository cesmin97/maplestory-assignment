/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from '../schema/event.schema';
import { CreateEventDto } from '../dto/create-event.dto';
import {
  EventCondition,
  EventConditionDocument,
} from '../schema/event-condition.schema';
import { EventListFilter } from '../dto/event-list.filter';
import {
  EventConditionResponseDto,
  EventResponseDto,
} from '../dto/event-response.dto';
import { toKstTime } from 'src/util/time.util';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(EventCondition.name)
    private eventConditionModel: Model<EventConditionDocument>,
  ) {}

  /**
   * 이벤트 생성
   * 이벤트 데이터를 통해 이벤트 생성
   * 이벤트 생성 후, 해당 이벤트 ID를 통해 이벤트 조건 생성
   * 조건 생성 시 DB 저장 비동기 처리
   *
   * @param dto 이벤트 데이터 및 조건 데이터 배열
   * @returns
   */
  async createEvent(dto: CreateEventDto) {
    /** 1. 이벤트 생성 */
    const newEvent = new this.eventModel({
      name: dto.name,
      description: dto.description,
      status: dto.status,
      startDate: dto.startDate,
      endDate: dto.endDate,
    });
    await newEvent.save();

    /** 2. 생성 된 이벤트의 ID 기반으로 조건 생성
     *  조건 저장 비동기 처리
     */
    const newEventConditions = dto.conditions.map(async (conditionDto) => {
      const newEventCondition = new this.eventConditionModel({
        type: conditionDto.type,
        value: conditionDto.value,
        description: conditionDto.description,
        isActivate: conditionDto.isActivate,
        eventId: newEvent._id,
      });

      await newEventCondition.save();
    });

    await Promise.all(newEventConditions);

    return { id: newEvent._id, name: newEvent.name };
  }

  /**
   * 이벤트 목록 조회
   * 추후, filter 적용 예정
   *
   * @param filter
   * @returns
   */
  async findEvents(filter: EventListFilter) {
    /** TODO: 조회 시 filter 적용 */
    /** 1. 이벤트 목록 조회 */
    const events = await this.eventModel.find();
    if (events.length == 0) {
      throw new NotFoundException('이벤트를 찾을 수 없습니다.');
    }

    /** 2. 각 이벤트에 해당하는 조건 목록 조회
     * 조건 목록 조회 비동기 처리
     */
    const responseTasks = events.map(async (event) => {
      const responseDto = await this.findEventById(event._id);
      return responseDto;
    });
    const responseDtos: EventResponseDto[] = await Promise.all(responseTasks);

    return responseDtos;
  }

  /**
   * 이벤트 ID 기반 이벤트 상세 조회
   *
   * @param eventId
   * @returns
   */
  async findEventById(eventId: string) {
    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new NotFoundException('이벤트를 찾을 수 없습니다.');
    }

    const responseDto: EventResponseDto = {
      id: event._id,
      name: event.name,
      description: event.description,
      status: event.status,
      startDate: event.startDate,
      endDate: event.endDate,
      createdAt: toKstTime(event.createdAt),
      conditions: [],
    };

    const eventConditions = await this.eventConditionModel.find({ eventId });

    eventConditions.map((condition) => {
      const conditionResponseDto: EventConditionResponseDto = {
        type: condition.type,
        value: condition.value,
        description: condition.description,
        isActivate: condition.isActivate,
      };
      responseDto.conditions.push(conditionResponseDto);
    });

    return responseDto;
  }
}
