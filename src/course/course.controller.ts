import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { CourseService } from './course.service';
import { Dtocreatecourse } from './dtocreatecourse';

@Controller('course')
export class CourseController {

    constructor(private CourseService:CourseService){}

    @Get('get-all-courses')
    async getallcourses(){
        return await this.CourseService.getallcourses()
    }


    @Get('get-courses/:courseId')
    async getcourses(courseId:string){
        return await this.CourseService.getcourses(courseId)
    }

    @Post('create-courses')
    async createcourses(@Body() data:Dtocreatecourse){
        return await this.CourseService.createcourses(data)
    }

    @Patch('update-courses/:courseId')
    async updatecourses(@Body() data:Dtocreatecourse,courseId:string){
        return await this.CourseService.updatecourses(data,courseId)
    }

    @Delete('delete-courses/:courseId')
    async deletecourses(courseId:string){
        return await this.CourseService.deletecourses(courseId)
    }
}
