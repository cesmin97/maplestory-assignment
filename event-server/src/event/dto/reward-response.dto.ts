/* eslint-disable prettier/prettier */
import { Reward, RewardType } from '../schema/reward.schema';

export class RewardResponseDto {
  id: string;

  type: RewardType;

  name: string;

  amount: number;

  description: string;

  eventId: string;

  isActivate: boolean;

  createdAt: Date;

  constructor(reward: Reward) {
    this.id = reward._id;
    this.type = reward.type;
    this.name = reward.name;
    this.amount = reward.amount;
    this.description = reward.description;
    this.eventId = reward.eventId;
    this.isActivate = reward.isActivate;
    this.createdAt = reward.createdAt;
  }
}
