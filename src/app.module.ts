import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ContactModule } from './contact/contact.module';
import { RedisModule } from './redis/redis.module';
import { SessionModule } from './session/session.module';
import AuthGuard from './auth/guard/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    ContactModule,
    PrismaModule,
    RedisModule,
    SessionModule,
    ],
    providers: [
      { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule {}
