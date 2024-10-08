import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService){}

    async editUser(user: User, dto: EditUserDto){
        console.log(user)
        const User = await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                ...dto,
            },
        });

        delete User.hash;

        return User;
    }

    async deleteUser(user: User){
        try{
            await this.prisma.user.delete({
                where: {
                    id: user.id,
                },
            });
            return "User deleted successfully";
            }
            catch (error) {
                throw error
              }
    }
}
