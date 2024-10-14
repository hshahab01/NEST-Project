import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {SessionService, SessionModel } from '../../session/session.service';

@Injectable()
export default class AuthGuard implements CanActivate {
    constructor(private _reflector: Reflector, private _authService: SessionService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const requiredAuthorization = this._reflector.get<string[]>(
            'authorization',
            context.getHandler(),
        );

        if (requiredAuthorization) {
            const token = request.headers['authorization'];
            if (!token) {
                throw new ForbiddenException('Unauthorized');
            }

            let auth: SessionModel = await this._authService.GetSession(token);
            if (
                !auth ||
                (auth && !auth.user) 
            ) {
                throw new ForbiddenException('Unauthorized');
            }

            request.user = auth.user;
        }

        return true;
    }
}
