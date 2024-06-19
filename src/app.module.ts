import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017'), UserModule, RedisModule],
})
export class AppModule {}
