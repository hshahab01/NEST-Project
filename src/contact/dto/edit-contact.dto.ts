import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsPositive, IsString } from "class-validator";

export class EditContactDto{

    @ApiProperty()
    @IsString()
    @IsOptional()
    name?: string
    
    @ApiProperty()
    @IsInt()
    @IsPositive()
    @IsOptional()
    number?: number
}