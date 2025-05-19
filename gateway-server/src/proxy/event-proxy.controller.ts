/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { BaseProxyController } from './base-proxy.controller';
import { ProxyService } from './proxy.service';

@Controller('event-api')
export class EventProxyController extends BaseProxyController {
  constructor(protected override readonly proxyService: ProxyService) {
    super(proxyService);
  }

  @Post('events')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  async createEvent(@Req() req: Request, @Res() res: Response) {
    return this.handleProxy(req, res);
  }

  @Post('rewards')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'OPERATOR')
  async createReward(@Req() req: Request, @Res() res: Response) {
    return this.handleProxy(req, res);
  }

  @Post('rewards/request')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'USER')
  async requestReward(@Req() req: Request, @Res() res: Response) {
    return this.handleProxy(req, res);
  }

  @Get('events')
  async getEvents(@Req() req: Request, @Res() res: Response) {
    return this.handleProxy(req, res);
  }

  @Get('events/:eventId')
  async getEventById(@Req() req: Request, @Res() res: Response) {
    return this.handleProxy(req, res);
  }

  @Get('events/:eventId/conditions')
  async getConditionsByEventId(@Req() req: Request, @Res() res: Response) {
    return this.handleProxy(req, res);
  }

  @Get('rewards')
  async getRewardsByEventId(@Req() req: Request, @Res() res: Response) {
    return this.handleProxy(req, res);
  }

  @Get('rewards/histories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'AUDITOR', 'OPERATOR')
  async getRewardHistories(@Req() req: Request, @Res() res: Response) {
    return this.handleProxy(req, res);
  }

  @Get('rewards/histories/my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'USER')
  async getMyRewardHistories(@Req() req: Request, @Res() res: Response) {
    return this.handleProxy(req, res);
  }
}
