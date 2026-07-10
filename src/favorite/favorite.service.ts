import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoriteService {
    constructor(private Prisma:PrismaService){}

 
    async Getfavorite(userId:string,supabaseId:string,courseId:string){
        const user=await this.Prisma.user.findUnique({
            where:{
                supabaseId:supabaseId
            }           
        })

        const course=await this.Prisma.course.findUnique({
            where:{
                id:courseId
            }
        })

        if (!user) {
            throw new NotFoundException('Utilisateur introuvable');
        }

        return await this.Prisma.favorite.findUnique({
            where:{
                userId_courseId:{
                    userId:user.id,
                    courseId
                }
            }
        })
    }

    async Addfavorite(userId:string,supabaseId:string,courseId:string){
        const user=await this.Prisma.user.findUnique({
            where:{
                supabaseId:supabaseId
            }           
        })

        const course=await this.Prisma.course.findUnique({
            where:{
                id:courseId
            }
        })

        if (!user) {
            throw new NotFoundException('Utilisateur introuvable');
        }
        return await this.Prisma.favorite.create({
            data:{
                userId:user.id,
                courseId
            }
        })
    
    }
}