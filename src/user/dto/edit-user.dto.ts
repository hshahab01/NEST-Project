import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsOptional, IsString } from "class-validator"

export class EditUserDto{

    @ApiProperty()
    @IsEmail()
    @IsOptional()
    email?: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    name?: string
}