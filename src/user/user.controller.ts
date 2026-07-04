
import { Controller, Delete, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Dtocreate } from './dtocreate';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getme(@Req() req:any){
        return await this.userService.getUser(req.user.supabaseId)
    }

    @Get('alluser')
    async getallUser(){
        return await this.userService.getallUser()
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deletecompte(@Req() req:any){
        return await this.userService.deletecompte(req.user.supabaseId)

    }
    
    async update(@Req() req:any, data:Dtocreate){
        return await this.userService.update(req.user.supabaseId,data)
    
    }
}
