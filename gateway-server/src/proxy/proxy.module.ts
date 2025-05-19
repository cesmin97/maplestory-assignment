/* eslint-disable prettier/prettier */
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthProxyController } from './auth-proxy.controller';
import { EventProxyController } from './event-proxy.controller';
import { ProxyService } from './proxy.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [AuthProxyController, EventProxyController],
  providers: [ProxyService],
})
export class ProxyModule {}
