import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { GetUser } from "./decorator";
import { User } from "@prisma/client";
import { AuthGuard } from "@nestjs/passport";
import { JwtGuard, RtGuard } from "./guard";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller('auth')
export class AuthSController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() dto: AuthDto) {
        return this.authService.login(dto);
    }

    @Post('signup')
    signup(@Body() dto: AuthDto) {
        return this.authService.signup(dto);
    }

    @ApiBearerAuth()
    @UseGuards(RtGuard)
    @Post('/refresh')
    refreshTokens(@GetUser() user: User) {
        return this.authService.refreshTokens(user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Post('/logout')
    logout(@GetUser() user: User) {
        return this.authService.logout(user);
    }

}