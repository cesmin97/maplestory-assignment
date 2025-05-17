/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { toKstTime } from 'src/util/time.util';
import { CreateEventDto } from '../dto/create-event.dto';
import { CreateRewardDto } from '../dto/create-reward.dto';
import { EventConditionResponseDto } from '../dto/event-condition-response.dto';
import { EventDetailResponseDto } from '../dto/event-detail-response.dto';
import { EventListResponseDto } from '../dto/event-list-response.dto';
import { EventListFilter } from '../dto/event-list.filter';
import { RewardResponseDto } from '../dto/reward-response.dto';
import {
  EventCondition,
  EventConditionDocument,
} from '../schema/event-condition.schema';
import { Event, EventDocument } from '../schema/event.schema';
import { Reward, RewardDocument } from '../schema/reward.schema';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(EventCondition.name)
    private eventConditionModel: Model<EventConditionDocument>,
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
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
    const promises = dto.conditions.map(async (conditionDto) => {
      const newEventCondition = new this.eventConditionModel({
        type: conditionDto.type,
        value: conditionDto.value,
        description: conditionDto.description,
        isActivate: conditionDto.isActivate,
        eventId: newEvent._id,
      });

      await newEventCondition.save();
      return newEventCondition;
    });
    const newEventConditions = await Promise.all(promises);

    /** 3. 생성 된 조건들로 조건 목록 ResponseDto 생성 */
    const conditionResponseDtos = newEventConditions.map((condition) => {
      return new EventConditionResponseDto(condition);
    });

    /** 4. 조건 목록을 포함한 이벤트 ResponseDto 생성 및 return */
    const responseDto = new EventDetailResponseDto(
      newEvent,
      conditionResponseDtos,
      [],
    );

    return responseDto;
  }

  /**
   * 이벤트 ID 기반 보상 생성
   *
   * @param eventId
   * @param dto
   * @returns
   */
  async createReward(eventId: string, dto: CreateRewardDto) {
    /** 1. 이벤트 검증 */
    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new BadRequestException('존재하지 않는 이벤트입니다.');
    }

    /** 2. 이벤트 ID 기반 보상 생성 */
    const newReward = new this.rewardModel({
      type: dto.type,
      amount: dto.amount,
      description: dto.description,
      eventId: eventId,
      isActivate: dto.isActivate,
      startDate: dto.startDate,
      endDate: dto.endDate,
    });
    await newReward.save();

    /** 3. 생성 된 보상으로 ResponseDto 생성 및 return */
    const responseDto: RewardResponseDto = new RewardResponseDto(newReward);

    return responseDto;
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

    /** 2. 조회한 이벤트 목록 Dto에 담아 return */
    const responseDtos = events.map((event) => {
      return new EventListResponseDto(event);
    });

    return responseDtos;
  }

  /**
   * 이벤트 ID 기반 이벤트 상세 조회
   * 조회한 이벤트 기반으로 조건 및 보상 목록 조회
   *
   * @param eventId
   * @returns 조건 및 보상 목록을 포함한 이벤트 상세 데이터
   */
  async findEventById(eventId: string) {
    /** 1. 이벤트 아이디 기반 이벤트 조회 */
    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new NotFoundException('이벤트를 찾을 수 없습니다.');
    }

    /** 2. 이벤트 아이디 기반 조건 목록 조회 */
    const conditions = await this.findConditionsByEventId(eventId);

    /** 3. 이벤트 아이디 기반 보상 목록 조회 */
    const rewards = await this.findRewardsByEventId(eventId);

    /** 4. ResponseDto로 만들어 return */
    const responseDto: EventDetailResponseDto = {
      id: event._id,
      name: event.name,
      description: event.description,
      status: event.status,
      startDate: event.startDate,
      endDate: event.endDate,
      createdAt: toKstTime(event.createdAt),
      conditions,
      rewards,
    };
    return responseDto;
  }

  /**
   * 이벤트 ID 기반 조건 목록 조회
   *
   * @param eventId
   * @returns
   */
  async findConditionsByEventId(eventId: string) {
    /** 1. 이벤트 검증 */
    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new BadRequestException('존재하지 않는 이벤트입니다.');
    }

    /** 2. 이벤트 ID 기반 조건 목록 조회 및 Dto에 담아 return */
    const conditions = await this.eventConditionModel.find({ eventId });
    const responseDtos = conditions.map((condition) => {
      return new EventConditionResponseDto(condition);
    });

    return responseDtos;
  }

  /**
   * 이벤트 ID 기반 보상 목록 조회
   *
   * @param eventId
   * @returns
   */
  async findRewardsByEventId(eventId: string) {
    /** 1. 이벤트 검증 */
    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new BadRequestException('존재하지 않는 이벤트입니다.');
    }

    /** 2. 이벤트 ID 기반 보상 목록 조회 및 Dto에 담아 return */
    const rewards = await this.rewardModel.find({ eventId });
    const responseDtos = rewards.map((reward) => {
      return new RewardResponseDto(reward);
    });

    return responseDtos;
  }
}
