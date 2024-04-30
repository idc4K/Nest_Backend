import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class SignUpDto{

    @IsString()
    @IsOptional()
    firstName: string

    @IsString()
    @IsOptional()
    lastName: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    @IsString()
    hash: string
}