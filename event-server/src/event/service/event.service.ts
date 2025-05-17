/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from '../schema/event.schema';
import { CreateEventDto } from '../dto/create-event.dto';
import {
  EventCondition,
  EventConditionDocument,
} from '../schema/event-condition.schema';

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

    /** 2. 생성 된 이벤트의 ID 기반으로 조건 생성 */
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

    /** 조건 저장 비동기처리 */
    await Promise.all(newEventConditions);

    return { id: newEvent._id, name: newEvent.name };
  }
}
