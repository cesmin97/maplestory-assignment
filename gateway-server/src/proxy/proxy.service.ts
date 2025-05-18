/* eslint-disable prettier/prettier */
// src/proxy/proxy.service.ts
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { AuthUserPayload } from 'src/auth/jwt.strategy';

@Injectable()
export class ProxyService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async proxyRequest(req: Request): Promise<any> {
    const {
      method,
      originalUrl: path,
      body,
      headers,
      ip,
      hostname,
      protocol,
    } = req;

    /** baseUrl 및 path 정리 */
    let baseUrl: string;
    let adjustedPath = path;

    if (path.startsWith('/auth-api')) {
      baseUrl = this.configService.get<string>('AUTH_SERVER');
      adjustedPath = path.replace('/auth-api', '');
    } else if (path.startsWith('/event-api')) {
      baseUrl = this.configService.get<string>('EVENT_SERVER');
      adjustedPath = path.replace('/event-api', '');
    } else {
      throw new NotFoundException('엔드포인트를 찾을 수 없습니다.');
    }

    const url = `${baseUrl}${adjustedPath}`;

    /** 2. 헤더 정제 및 추가 */
    const blockedHeaders = ['content-length', 'host', 'connection'];
    const safeHeaders = Object.fromEntries(
      Object.entries(headers).filter(
        ([key, value]) =>
          !blockedHeaders.includes(key.toLowerCase()) &&
          typeof value === 'string',
      ),
    ) as Record<string, string>;

    const forwardedHeaders = {
      'X-Forwarded-For': ip,
      'X-Forwarded-Host': hostname,
      'X-Forwarded-Proto': protocol,
      'X-Request-Id': randomUUID(),
    };
    if (req.user) {
      const user = req.user as AuthUserPayload;
      forwardedHeaders['X-User-Id'] = user.userId;
    }

    const config = {
      headers: {
        ...safeHeaders,
        ...forwardedHeaders,
      },
    };

    /** 3. 요청 실행 */
    switch (method.toUpperCase()) {
      case 'GET':
        return (await firstValueFrom(this.httpService.get(url, config))).data;
      case 'POST':
        return (await firstValueFrom(this.httpService.post(url, body, config)))
          .data;
      case 'PUT':
        return (await firstValueFrom(this.httpService.put(url, body, config)))
          .data;
      case 'PATCH':
        return (await firstValueFrom(this.httpService.patch(url, body, config)))
          .data;
      case 'DELETE':
        return (
          await firstValueFrom(
            this.httpService.request({
              method: 'DELETE',
              url,
              data: body,
              ...config,
            }),
          )
        ).data;
      default:
        throw new BadRequestException(`${method} 메서드는 지원하지 않습니다.`);
    }
  }
}
