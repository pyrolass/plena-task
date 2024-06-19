import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { RedisService } from './redis.service';
import { Observable, of } from 'rxjs';

@Injectable()
export class RedisInterceptor implements NestInterceptor {
  constructor(private readonly redisService: RedisService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    if (!this.redisService.isRedisWorking()) {
      return next.handle();
    }

    const key = this.redisService.requestToKey(request);
    const cachedValue = await this.redisService.get(key);
    if (cachedValue) {
      try {
        const data = JSON.parse(this.redisService.decompress(cachedValue));
        return of(data);
      } catch {
        return of(cachedValue);
      }
    }

    return next.handle().pipe(
      tap(async (data) => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          const toCache = this.redisService.compress(JSON.stringify(data));
          await this.redisService.set(key, toCache, { EX: 10800 }); // 3 hours
        }
      }),
    );
  }
}
