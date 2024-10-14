import { Body, Controller, Delete, Get, Patch, UseGuards } from '@nestjs/common';
import { Authorized, GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';


@Controller({ path: 'users' })
@ApiTags("User")
export class UserController {
    constructor(private userService: UserService) {}
    @Authorized()
    @Get('me')
    getMe(@GetUser() user: User){
        return user;
    }

    @Authorized()
    @Patch()
    editUser(
        @GetUser() user: User,
        @Body() dto: EditUserDto
    ){
        return this.userService.editUser(user,dto)
    }
    
    @Authorized()
    @Delete()
    deleteUser(@GetUser() user: User){
        console.log(user)
        return this.userService.deleteUser(
            user,
        );
    }
}
