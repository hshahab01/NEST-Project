import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { GetUser } from "./decorator";
import { User } from "@prisma/client";
import { AuthGuard } from "@nestjs/passport";
import { JwtGuard } from "./guard";

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

    @UseGuards(AuthGuard('jwt-refresh '))
    @Post('/refresh')
    refreshTokens() {
        return this.authService.refreshTokens();
    }

    @UseGuards(JwtGuard)
    @Post('/logout')
    logout(@GetUser() user: User) {
        return this.authService.logout(user);
    }

}