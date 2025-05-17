/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventController } from './controller/event.controller';
import { Event, EventSchema } from './schema/event.schema';
import { EventService } from './service/event.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      // { name: Event.name, schema: EventSchema },
      // { name: Event.name, schema: EventSchema },
      // { name: Event.name, schema: EventSchema },
      // { name: Event.name, schema: EventSchema },
      // { name: Event.name, schema: EventSchema },
    ]),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
