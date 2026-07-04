import { Controller, Post, Get, Patch, Delete, Body, Param, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Dtocreateenr } from './dtoenro';

@Controller('enrollments')
export class EnrollmentController {
    constructor(private readonly enrollmentService: EnrollmentService) {}

    @Post(':courseId')
    @UseGuards(JwtAuthGuard)
    async create(
        @Param('courseId') courseId: string,
        @Req() req: any,
        @Body() data: Dtocreateenr
    ) {
        return await this.enrollmentService.create(courseId, req.user.supabaseId, data);
    }

    @Get('my-enrollments')
    @UseGuards(JwtAuthGuard)
    async findAllByUser(@Req() req: any) {
        return await this.enrollmentService.findAllByUser(req.user.supabaseId);
    }

    @Get(':courseId')
    @UseGuards(JwtAuthGuard)
    async findOne(
        @Param('courseId') courseId: string,
        @Req() req: any
    ) {
        return await this.enrollmentService.findOne(courseId, req.user.supabaseId);
    }

    @Patch(':courseId/progress')
    @UseGuards(JwtAuthGuard)
    async updateProgress(
        @Param('courseId') courseId: string,
        @Req() req: any,
        @Body('progress', ParseIntPipe) progress: number
    ) {
        return await this.enrollmentService.updateProgress(courseId, req.user.supabaseId, progress);
    }

    @Delete(':courseId')
    @UseGuards(JwtAuthGuard)
    async remove(
        @Param('courseId') courseId: string,
        @Req() req: any
    ) {
        return await this.enrollmentService.remove(courseId, req.user.supabaseId);
    }
}
