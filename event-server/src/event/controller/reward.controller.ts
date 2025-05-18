/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import { CreateRewardDto } from '../dto/create-reward.dto';
import { RewardHistoryResponseDto } from '../dto/reward-history-response.dto';
import { RewardResponseDto } from '../dto/reward-response.dto';
import { RewardService } from '../service/reward.service';

@Controller('rewards')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  /**
   * 보상 등록 API
   * 관리자, 운영자만 접근 가능
   *
   * @param eventId
   * @param dto
   * @returns
   */
  @Post('')
  async createReward(
    @Query('eventId') eventId: string,
    @Body() dto: CreateRewardDto,
  ) {
    const reward: RewardResponseDto = await this.rewardService.createReward(
      eventId,
      dto,
    );

    return {
      message: '보상 생성 성공',
      reward,
    };
  }

  /**
   * 보상 요청 API
   *
   * @param eventId
   * @returns
   */
  @Post('request/')
  async requestReward(
    @Query('eventId') eventId: string,
    @Headers('x-user-id') userId: string,
  ) {
    const responseDto: RewardHistoryResponseDto =
      await this.rewardService.requestReward(eventId, userId);
    return {
      message: '보상 요청 결과',
      responseDto,
    };
  }

  /**
   * 이벤트 ID 기반 보상 목록 조회 API
   *
   * @param eventId
   * @returns
   */
  @Get('')
  async getRewardsByEventId(@Query('eventId') eventId: string) {
    const rewards: RewardResponseDto[] =
      await this.rewardService.findRewardsByEventId(eventId);

    return {
      message: '이벤트 보상 목록 조회 성공',
      rewards,
    };
  }

  /**
   * 전체 보상 이력 목록 조회 API
   * 운영자, 감시자 접근 가능
   *
   * @param eventId
   * @returns
   */
  @Get('histories')
  async getRewardHistories() {
    const rewardHistories: RewardHistoryResponseDto[] =
      await this.rewardService.findRewardHistories();

    return {
      message: '이벤트 보상 이력 목록 조회 성공',
      rewardHistories,
    };
  }

  /**
   * 현재 사용자 기준 보상 이력 목록 조회 API
   * 사용자 접근 가능
   *
   * @param eventId
   * @returns
   */
  @Get('histories/my')
  async getMyRewardHistories(@Headers('x-user-id') userId: string) {
    const rewardHistories: RewardHistoryResponseDto[] =
      await this.rewardService.findRewardHistoriesByUserId(userId);

    return {
      message: '현재 사용자 기준 이벤트 보상 이력 목록 조회 성공',
      rewardHistories,
    };
  }
}
