import { IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";

export class CreateContactDto{
    @IsString()
    @IsNotEmpty()
    name: string
    
    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    number: number
}