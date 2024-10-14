import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDto } from "./dto";
import { PrismaService } from "../prisma/prisma.service";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { User } from "@prisma/client";
import { SessionService } from "../session/session.service";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private _authService: SessionService,
    ) { }

    async login(dto: AuthDto) {

        //user checked by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        //user not found error
        if (!user) {
            throw new ForbiddenException('Incorrect email - user not found')
        }
        //password check
        const pwCheck = await argon.verify(
            user.hash,
            dto.password,
        );

        if (!pwCheck) {
            throw new ForbiddenException('Incorrect password - please try again')
        }
        const token = await this._authService.CreateSession(user.id);

        return token;
    }

    async signup(dto: AuthDto) {
        //password hash
        const hash = await argon.hash(dto.password);
        //save user
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                },
            });

            const token = await this._authService.CreateSession(user.id);
            return token;
        }
        catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Email already in use')
                }
            }
            throw error;
        }
    }

    async logout(user: User, headers) {
        console.log(headers)
        await this._authService.DestroySession(headers.authorization)
    }


}