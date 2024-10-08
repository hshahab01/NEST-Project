import { Body, Controller, Delete, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import {JwtGuard} from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}
    @Get('me')
    getMe(@GetUser() user: User){
        return user;
    }

    @Patch()
    editUser(
        @GetUser() user: User,
        @Body() dto: EditUserDto
    ){
        return this.userService.editUser(user,dto)
    }
    
    @Delete()
    deleteContact(@GetUser() user: User){
        console.log(user)
        return this.userService.deleteUser(
            user,
        );
    }
}
