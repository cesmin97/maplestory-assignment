/* eslint-disable prettier/prettier */
import { HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from './proxy.service';

export class BaseProxyController {
  constructor(protected readonly proxyService: ProxyService) {}

  /**
   * 프록시 요청 처리 + 예외 전달 공통 처리
   */
  protected async handleProxy(req: Request, res: Response) {
    try {
      const response = await this.proxyService.proxyRequest(req);

      return res
        .status(response.status)
        .set(response.headers)
        .send(response.data);
    } catch (error: any) {
      if (error.response && error.isAxiosError) {
        const { status, data } = error.response;
        return res.status(status).json(data);
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Gateway 처리 중 오류가 발생했습니다.' });
    }
  }
}
