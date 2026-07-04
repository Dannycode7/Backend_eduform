import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
    constructor(private Prisma:PrismaService,
        private Supabase:SupabaseService
    ){}

    async signup(email:string,password:string,name:string){
        const {data,error}= await this.Supabase.admin.auth.admin.createUser({
            email,
            password,
            email_confirm:true
        })

        if(error||!data.user) throw new Error(error?.message)

            const user=await this.Prisma.user.create({
                data:{
                    supabaseId:data.user.id,
                    name,
                    email
                }
            })

            return await this.signin(email,password)
    }

    async signin(email:string,password:string){
        const {data,error}=await this.Supabase.admin.auth.signInWithPassword({
            email,
            password
        })

        if(error||!data.user) throw new Error(error?.message)

            const user=await this.Prisma.user.findUnique({
                where:{
                    supabaseId:data.user.id
                }
            })

            return {user:user,token:data.session?.access_token}
    }
}
