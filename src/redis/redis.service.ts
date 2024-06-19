// src/redis/redis.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import * as zlib from 'zlib';
import * as objectHash from 'object-hash';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  async onModuleInit() {
    this.client = createClient({ url: process.env.REDIS_URL });
    this.client.on('error', (err) => console.error('Redis Client Error', err));
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async set(key: string, value: any, options: any) {
    return this.client.set(key, value, options);
  }

  async get(key: string) {
    return this.client.get(key);
  }

  isRedisWorking() {
    return this.client.isOpen;
  }

  requestToKey(req: any): string {
    const reqDataToHash = {
      query: req.query,
      body: req.body,
    };
    return `${req.path}@${objectHash.sha1(reqDataToHash)}`;
  }

  compress(data: any): string {
    return zlib.deflateSync(Buffer.from(data)).toString('base64');
  }

  decompress(data: string): string {
    return zlib.inflateSync(Buffer.from(data, 'base64')).toString();
  }
}
