import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import {RedisService} from './redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';


const redisStore = require('cache-manager-redis-store').redisStore;

@Module({
    imports: [
        CacheModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (config : ConfigService) => ({
            store: redisStore,
            host: config.get('REDIS_HOST'),
            port: config.get('REDIS_PORT'),  
            }),
            inject: [ConfigService]
        }),
    ],
    exports: [RedisService],
    providers: [RedisService],
})
export  class RedisModule {}


9