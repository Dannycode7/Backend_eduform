import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Dtocreate } from './dtocreate';

@Injectable()
export class UserService {
    constructor(private Prisma:PrismaService){}

    async getallUser(){
        const user=await this.Prisma.user.findMany()
        return user
    }

    async getUser(supabaseId:string){
        const user=await this.Prisma.user.findUnique({
            where:{
                supabaseId:supabaseId
            }
        })
        return user
    }

   async update(supabaseId:string,data:Dtocreate){
    const user=await this.Prisma.user.update({
        where:{
            supabaseId:supabaseId
        },
        data
    })
   }

   async deletecompte(supabaseId:string){
    const user=await this.Prisma.user.delete({
        where:{
            supabaseId:supabaseId
        }
    })
   }
}
