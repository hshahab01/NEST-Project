import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDto } from "./dto";
import { PrismaService } from "../prisma/prisma.service";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { User } from "@prisma/client";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
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
        const tokens = await this.signToken(user.id, user.email);
        await this.updateRt(user.id, tokens.refresh_token);
        return tokens;
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

            const tokens = await this.signToken(user.id, user.email);

            await this.updateRt(user.id, tokens.refresh_token)
            return this.signToken(user.id, user.email);
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

    async signToken(
        userId: number,
        email: string,
    ): Promise<{ access_token: string, refresh_token: string }> {
        const payload = {
            sub: userId,
            email,
        }
        const a_secret = this.config.get('JWT_SECRET')
        const r_secret = this.config.get('JWT_SECRET')

        const [access_token, refresh_token] = await Promise.all([
            this.jwt.signAsync(payload,
                {
                    expiresIn: '15m',
                    secret: a_secret,
                }
            ),
            this.jwt.signAsync(payload,
                {
                    expiresIn: '10080m',
                    secret: r_secret,
                }
            )
        ]);
        return {
            access_token,
            refresh_token,
        }

    }

    async updateRt(userId: number, rt: string) {
        const hash = await argon.hash(rt);
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                hashedRt: hash,
            },
        });
    }

    async logout(user: User) {
        await this.prisma.user.updateMany({
            where: {
                id: user.id,
                hashedRt: {
                    not: null,
                },
            },
            data: {
                hashedRt: null,
            }
        })
    }

    async refreshTokens(user: User) {
        console.log(user['sub'])
        const temp = await this.prisma.user.findUnique({
            where: {
                id: user['sub'],
            },
        });
        if (!temp) throw new ForbiddenException("User not found")

            console.log(temp.hashedRt)

        const rtMatches = await argon.verify(temp.hashedRt,user['refreshToken'])
        if (!rtMatches) throw new ForbiddenException("Access Denied")

        const tokens = await this.signToken(temp.id, temp.email);
        await this.updateRt(temp.id, tokens.refresh_token);
        return tokens;
    }

}