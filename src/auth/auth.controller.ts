import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Dtoauthcreate } from './dtoauthcreate';

@Controller('auth')
export class AuthController {
    constructor(private Authservice:AuthService){}

    @Post('signup')
    async signup(@Body() data:Dtoauthcreate){
        return await this.Authservice.signup(data.email,data.password,data.name)

    }

    @Post('signin')
    async signin(@Body() data:{email:string,password:string}){
        return await this.Authservice.signin(data.email,data.password)
    }
    
}
