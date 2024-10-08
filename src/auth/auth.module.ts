import { Module } from "@nestjs/common";
import { AuthSController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import {  JwtRefreshStrategy, JwtStrategy } from "./strategy";


@Module({
    imports: [JwtModule.register({})],
    controllers: [AuthSController],
    providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
})
export  class AuthModule {}