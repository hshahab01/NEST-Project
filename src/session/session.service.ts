import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import {RedisService} from '../redis/redis.service';
import {  User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

export class SessionModel {
    id: number;
    user: User | null;

    constructor(id: number, user?: User) {
        this.id = id;
        if (user) {
            this.user = user;
        }
    }
}

@Injectable()
export  class SessionService {
    constructor(
        private _cacheService: RedisService,
        private prisma: PrismaService,
        private config: ConfigService,
    ) {}

    private _generateToken() {
        return uuid();
    }

    async CreateSession(userId: number, fcmToken?: string): Promise<string> {
        const Token = this._generateToken();
        const Auth = new SessionModel(userId);
        await this._cacheService.Set(Token, Auth, this.config.get('TOKEN_EXPIRATION'));
        return Token;
    }

    async GetSession(token: string): Promise<SessionModel> {
        const Auth: SessionModel = await this._cacheService.Get(token);
        if (!Auth) return null;
        Auth.user = await this.prisma.user.findFirst({
            where: { id: Auth.id },
        });

        return Auth;
    }

    async DestroySession(token: string) {
        const Auth: SessionModel = await this._cacheService.Get(token);
        if (!Auth) return null;
        await this._cacheService.Delete(token);
        return true;
    }

}
