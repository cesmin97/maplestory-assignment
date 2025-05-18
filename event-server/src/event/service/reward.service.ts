/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { toKstTime } from 'src/util/time.util';
import { CreateRewardDto } from '../dto/create-reward.dto';
import { RewardHistoryResponseDto } from '../dto/reward-history-response.dto';
import { RewardResponseDto } from '../dto/reward-response.dto';
import {
  EventCondition,
  EventConditionDocument,
  EventConditionType,
} from '../schema/event-condition.schema';
import { Event, EventDocument, EventStatus } from '../schema/event.schema';
import {
  FriendInviteHistory,
  FriendInviteHistoryDocument,
} from '../schema/friend-invite-history.schema';
import {
  LoginHistory,
  LoginHistoryDocument,
} from '../schema/login-history.schema';
import {
  RewardHistory,
  RewardHistoryDocument,
  RewardHistoryStatus,
} from '../schema/reward-history.schema';
import { Reward, RewardDocument } from '../schema/reward.schema';

@Injectable()
export class RewardService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(EventCondition.name)
    private eventConditionModel: Model<EventConditionDocument>,
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
    @InjectModel(RewardHistory.name)
    private rewardHistoryModel: Model<RewardHistoryDocument>,
    @InjectModel(LoginHistory.name)
    private loginHistoryModel: Model<LoginHistoryDocument>,
    @InjectModel(FriendInviteHistory.name)
    private friendInviteHistoryModel: Model<FriendInviteHistoryDocument>,
  ) {}

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
      name: dto.name,
      amount: dto.amount,
      description: dto.description,
      eventId: eventId,
      isActivate: dto.isActivate,
    });
    await newReward.save();

    /** 3. 생성 된 보상으로 ResponseDto 생성 및 return */
    const responseDto: RewardResponseDto = new RewardResponseDto(newReward);

    return responseDto;
  }

  /**
   * 이벤트 ID 기반 보상 요청
   *
   * @param eventId
   * @returns
   */
  async requestReward(eventId: string, userId: string) {
    /** 1. 이벤트 검증 */
    const event = await this.eventModel.findOne({
      _id: eventId,
      status: EventStatus.ACTIVATE,
    });
    if (!event) {
      throw new BadRequestException('유효하지 않은 이벤트입니다.');
    }

    /** 3. 중복 보상 검증
     *
     * 성공, 대기 중, 취소 상태인 보상 이력이 존재 시 예외 처리
     */
    const existingRewardHistories = await this.rewardHistoryModel.find({
      userId,
      eventId,
      status: {
        $in: [
          RewardHistoryStatus.SUCCESS,
          RewardHistoryStatus.PENDING,
          RewardHistoryStatus.CANCELLED,
        ],
      },
    });
    if (existingRewardHistories.length > 0) {
      throw new BadRequestException('보상 신청이 불가합니다.');
    }

    /** 4. 이벤트 ID 기반 이벤트 조건 목록 조회 */
    const conditions = await this.eventConditionModel.find({
      eventId,
      isActivate: true,
    });

    /** 5. 이벤트 ID 기반 보상 목록 조회 */
    const rewards = await this.rewardModel.find({
      eventId,
      isActivate: true,
    });
    const rewardIds = rewards.map((reward) => reward._id);

    /** 6. 보상 이력 데이터 생성 */
    const newRewardHistory = new this.rewardHistoryModel({
      userId,
      eventId,
      rewardIds,
      status: RewardHistoryStatus.FAIL,
      requestDate: toKstTime(new Date()),
      rewardDate: null,
    });

    /** 7. 조건 존재 시 조건 만족 여부 검증 */
    for (let i = 0; i < conditions.length; i++) {
      const condition = conditions[i];

      const result = await this.validateConditon(event, condition, userId);
      if (!result) {
        await newRewardHistory.save();
        throw new BadRequestException(
          '이벤트에 대한 조건이 미달성 상태입니다.',
        );
      }
    }

    /** 8. 보상 성공 이력 저장 */
    newRewardHistory.status = RewardHistoryStatus.SUCCESS;
    newRewardHistory.requestDate = toKstTime(new Date());
    newRewardHistory.rewardDate = toKstTime(new Date());

    await newRewardHistory.save();

    return new RewardHistoryResponseDto(newRewardHistory);
  }

  async validateConditon(
    event: Event,
    condition: EventCondition,
    userId: string,
  ) {
    if (condition.type == EventConditionType.LOGIN_STREAK) {
      const loginDates = await this.loginHistoryModel.aggregate([
        {
          $match: {
            userId,
            loginAt: { $gte: event.startDate, $lte: event.endDate },
          },
        },
        {
          $project: {
            day: {
              $dateToString: { format: '%Y-%m-%d', date: '$loginAt' },
            },
          },
        },
        {
          $group: {
            _id: '$day',
          },
        },
        {
          $project: {
            _id: 0,
            day: '$_id',
          },
        },
        {
          $sort: { day: 1 },
        },
      ]);
      const dateStrings = loginDates.map((item) => item.day);

      const requiredStreak = condition.value;
      let streak = 1;

      console.log('dateStrings: ', dateStrings);
      for (let i = 1; i < dateStrings.length; i++) {
        const prevDate = new Date(dateStrings[i - 1]);
        const currDate = new Date(dateStrings[i]);

        const diffInMs = currDate.getTime() - prevDate.getTime();
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

        if (diffInDays === 1) {
          streak++;

          if (streak >= requiredStreak) {
            return true;
          }
        } else {
          streak = 1;
        }
      }

      return false;
    } else if (condition.type == EventConditionType.FRIEND_INVITE) {
      const friendInviteHistorys = await this.friendInviteHistoryModel.find({
        userId,
      });

      if (friendInviteHistorys.length >= condition.value) {
        return true;
      }

      return false;
    } else {
      return false;
    }
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

  /**
   * 보상 이력 목록 조회
   *
   * @returns
   */
  async findRewardHistories() {
    const rewardHistories = await this.rewardHistoryModel.find();
    const responseDtos = rewardHistories.map((history) => {
      return new RewardHistoryResponseDto(history);
    });

    return responseDtos;
  }

  /**
   * 사용자 ID 기반 보상 이력 목록 조회
   *
   * @param userId
   * @returns
   */
  async findRewardHistoriesByUserId(userId: string) {
    const rewardHistories = await this.rewardHistoryModel.find({
      userId,
    });
    const responseDtos = rewardHistories.map((history) => {
      return new RewardHistoryResponseDto(history);
    });

    return responseDtos;
  }
}
