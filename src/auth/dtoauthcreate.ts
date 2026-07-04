import { IsEmail, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class Dtoauthcreate {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;

    @IsUrl()
    @IsNotEmpty()
    avatarUrl!: string;
}
