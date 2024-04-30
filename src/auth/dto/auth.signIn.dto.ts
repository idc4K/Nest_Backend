import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class SignInDto{
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    hash: string

}