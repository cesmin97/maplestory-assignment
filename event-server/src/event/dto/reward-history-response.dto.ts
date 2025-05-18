/* eslint-disable prettier/prettier */
import { toKstTime } from 'src/util/time.util';
import { RewardHistory } from '../schema/reward-history.schema';

export class RewardHistoryResponseDto {
  id: string;

  userId: string;

  eventId: string;

  rewardIds: string[];

  status: string;

  requestDate: Date;

  rewardDate: Date;

  createdAt: Date;

  constructor(rewardHistory: RewardHistory) {
    this.id = rewardHistory._id;
    this.userId = rewardHistory.userId;
    this.eventId = rewardHistory.eventId;
    this.rewardIds = rewardHistory.rewardIds;
    this.status = rewardHistory.status;
    this.requestDate = rewardHistory.requestDate;
    this.rewardDate = rewardHistory.rewardDate;
    this.createdAt = toKstTime(rewardHistory.createdAt);
  }
}
