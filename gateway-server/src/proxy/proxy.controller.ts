/* eslint-disable prettier/prettier */
// src/proxy/proxy.controller.ts
import {
  All,
  Controller,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { OptionalJwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ProxyService } from './proxy.service';

@Controller()
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  /**
   * 프록시 API
   *
   * 인증: OptionalJwtAuthGuard, RolesGuard 사용
   * 인증이 필요한 요청은 req.user가 없으면 401 반환
   * 실제 프록시 요청은 proxyService에 위임
   */
  @All('*')
  @UseGuards(OptionalJwtAuthGuard, RolesGuard)
  async handleAll(@Req() req: Request, @Res() res: Response) {
    try {
      const { method, originalUrl: path } = req;

      /**
       * 1. 인증 없이 허용되는 공개 API 경로 정의
       *
       * 로그인, 회원가입 API는 비로그인 상태에서도 접근 가능
       */
      const isPublic =
        (method === 'POST' && path === '/auth-api/auth/signin') ||
        (method === 'POST' && path === '/auth-api/auth/signup');

      /** 2. 인증이 필요한 요청인데 사용자 정보(req.user)가 없다면 401 응답 */
      if (!isPublic && !req.user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: '인증이 필요합니다.',
        });
      }

      /** 3. 프록시 처리 */
      const data = await this.proxyService.proxyRequest(req);

      return res.status(HttpStatus.OK).json(data);
    } catch (error: any) {
      /** AxiosError인 경우, 백엔드 서버에서 응답한 status, data를 그대로 전달 */
      if (error.response && error.isAxiosError) {
        const { status, data } = error.response;
        return res.status(status).json(data);
      }

      /** 그 외 Gateway 내부 에러 처리 */
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Gateway 처리 중 알 수 없는 오류가 발생했습니다.' });
    }
  }
}
