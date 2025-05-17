/* eslint-disable prettier/prettier */
// src/proxy/proxy.module.ts
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProxyController } from './proxy.controller';
import { ProxyService } from './proxy.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [ProxyController],
  providers: [ProxyService],
})
export class ProxyModule {}
