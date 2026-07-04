import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { Dtocreatecourse } from './dtocreatecourse';

@Injectable()
export class CourseService {
    constructor(private Prisma:PrismaService,
         Supabase:SupabaseService
    ){}

    async getallcourses(){
        return await this.Prisma.course.findMany()
    }

    async createcourses(data:Dtocreatecourse){
        return await this.Prisma.course.create({
            data
        })
    }

    async getcourses(courseId:string){
        return await this.Prisma.course.findUnique({
            where:{
                id:courseId
            }
        })
    }

    async updatecourses(data:Dtocreatecourse,courseId:string){
        return await this.Prisma.course.update({
            where:{
                id:courseId
            },
            data
        })
    }

    async deletecourses(courseId:string){
        return await this.Prisma.course.delete({
            where:{
                id:courseId
            }
        })
    }
}
