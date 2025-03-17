import { RedisMemoryServer } from 'redis-memory-server';

import { BullModule, BullRootModuleOptions } from '@nestjs/bullmq';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

const bullModuleFactory = (): DynamicModule =>
  BullModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService): BullRootModuleOptions => {
      return {
        connection: {
          host: configService.getOrThrow('REDIS_HOST'),
          port: configService.getOrThrow('REDIS_PORT'),
        },
      };
    },
  });

const bullInMemoryModuleFactory = (): DynamicModule =>
  BullModule.forRootAsync({
    useFactory: async (): Promise<BullRootModuleOptions> => {
      const redisServer = await RedisMemoryServer.create();
      const host = await redisServer.getHost();
      const port = await redisServer.getPort();

      return {
        connection: {
          host,
          port,
        },
      };
    },
  });

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
    process.env.NODE_ENV === 'test'
      ? bullInMemoryModuleFactory()
      : bullModuleFactory(),
  ],
})
export class QueueModule {}
