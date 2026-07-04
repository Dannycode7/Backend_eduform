import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class Dtocreate {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsUrl()
    @IsNotEmpty()
    avatarUrl!: string;
}
