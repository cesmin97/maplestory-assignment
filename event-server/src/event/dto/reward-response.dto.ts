/* eslint-disable prettier/prettier */
import { Reward, RewardType } from '../schema/reward.schema';

export class RewardResponseDto {
  id: string;

  type: RewardType;

  amount: number;

  description: string;

  eventId: string;

  isActivate: boolean;

  startDate: Date;

  endDate: Date;

  createdAt: Date;

  constructor(reward: Reward) {
    this.id = reward._id;
    this.type = reward.type;
    this.amount = reward.amount;
    this.description = reward.description;
    this.eventId = reward.eventId;
    this.isActivate = reward.isActivate;
    this.startDate = reward.startDate;
    this.endDate = reward.endDate;
    this.createdAt = reward.createdAt;
  }
}
