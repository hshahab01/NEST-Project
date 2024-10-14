import { Body, Controller, Headers, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { Authorized, GetUser } from "./decorator";
import { User } from "@prisma/client";
import { ApiTags } from "@nestjs/swagger";

@Controller({ path: 'auth' })
@ApiTags("Authorization")
export class AuthController {
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

    // @ApiBearerAuth()
    // @UseGuards(RtGuard)
    // @Post('/refresh')
    // refreshTokens(@GetUser() user: User) {
    //     return this.authService.refreshTokens(user);
    // }

    @Authorized()
    @Post('/logout')
    logout(@GetUser() user: User, @Headers() headers) {
        return this.authService.logout(user, headers);
    }

}