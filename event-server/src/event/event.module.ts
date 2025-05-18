/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventController } from './controller/event.controller';
import { RewardController } from './controller/reward.controller';
import {
  EventCondition,
  EventConditionSchema,
} from './schema/event-condition.schema';
import { Event, EventSchema } from './schema/event.schema';
import {
  FriendInviteHistory,
  FriendInviteHistorySchema,
} from './schema/friend-invite-history.schema';
import {
  LoginHistory,
  LoginHistorySchema,
} from './schema/login-history.schema';
import {
  RewardHistory,
  RewardHistorySchema,
} from './schema/reward-history.schema';
import { Reward, RewardSchema } from './schema/reward.schema';
import { EventService } from './service/event.service';
import { RewardService } from './service/reward.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: EventCondition.name, schema: EventConditionSchema },
      { name: Reward.name, schema: RewardSchema },
      { name: RewardHistory.name, schema: RewardHistorySchema },
      { name: LoginHistory.name, schema: LoginHistorySchema },
      { name: FriendInviteHistory.name, schema: FriendInviteHistorySchema },
    ]),
  ],
  controllers: [EventController, RewardController],
  providers: [EventService, RewardService],
})
export class EventModule {}
