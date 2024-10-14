import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";

export class CreateContactDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string
    
    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    number: number
}