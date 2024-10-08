import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";

export class EditContactDto{
    @IsString()
    @IsOptional()
    name?: string
    
    @IsInt()
    @IsPositive()
    @IsOptional()
    number?: number
}