/* eslint-disable prettier/prettier */
import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { BaseProxyController } from './base-proxy.controller';
import { ProxyService } from './proxy.service';

@Controller('auth-api')
export class AuthProxyController extends BaseProxyController {
  constructor(protected override readonly proxyService: ProxyService) {
    super(proxyService);
  }

  @Post('auth/signup')
  async signUp(@Req() req: Request, @Res() res: Response) {
    return this.handleProxy(req, res);
  }

  @Post('auth/signin')
  async signIn(@Req() req: Request, @Res() res: Response) {
    return this.handleProxy(req, res);
  }

  @Post('auth/reissue')
  async reissue(@Req() req: Request, @Res() res: Response) {
    return this.handleProxy(req, res);
  }

  @Post('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createUser(@Req() req: Request, @Res() res: Response) {
    return this.handleProxy(req, res);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getUsers(@Req() req: Request, @Res() res: Response) {
    return this.handleProxy(req, res);
  }

  @Patch('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateUser(@Req() req: Request, @Res() res: Response) {
    return this.handleProxy(req, res);
  }

  @Patch('users/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateRole(@Req() req: Request, @Res() res: Response) {
    return this.handleProxy(req, res);
  }

  @Delete('auth/revoke-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async revokeToken(@Req() req: Request, @Res() res: Response) {
    return this.handleProxy(req, res);
  }
}
