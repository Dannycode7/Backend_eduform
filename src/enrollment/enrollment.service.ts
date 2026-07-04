import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Dtocreateenr } from './dtoenro';

@Injectable()
export class EnrollmentService {

    constructor(private prisma: PrismaService) { }


    async create(courseId: string, supabaseId: string, data: Dtocreateenr) {
        const user = await this.prisma.user.findUnique({
            where: { supabaseId: supabaseId }
        });
        if (!user) {
            throw new NotFoundException(`Utilisateur introuvable avec l'ID Supabase fourni.`);
        }

        const course = await this.prisma.course.findUnique({
            where: { id: courseId }
        });
        if (!course) {
            throw new NotFoundException(`Le cours avec l'ID ${courseId} n'existe pas.`);
        }

        const existingEnrollment = await this.prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: courseId
                }
            }
        });
        if (existingEnrollment) {
            throw new BadRequestException(`L'utilisateur est déjà inscrit à ce cours.`);
        }

        const { courseId: _, userId: __, ...enrollmentData } = data;

        return await this.prisma.enrollment.create({
            data: {
                userId: user.id,
                courseId: courseId,
                ...enrollmentData
            }
        });
    }

    async findAllByUser(supabaseId: string) {
        const user = await this.prisma.user.findUnique({
            where: { supabaseId: supabaseId }
        });
        if (!user) {
            throw new NotFoundException(`Utilisateur introuvable.`);
        }

        return await this.prisma.enrollment.findMany({
            where: { userId: user.id },
            include: { course: true }
        });
    }

    async findOne(courseId: string, supabaseId: string) {
        const user = await this.prisma.user.findUnique({
            where: { supabaseId: supabaseId }
        });
        if (!user) {
            throw new NotFoundException(`Utilisateur introuvable.`);
        }

        const enrollment = await this.prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: courseId
                }
            },
            include: { course: true }
        });

        if (!enrollment) {
            throw new NotFoundException(`Inscription introuvable pour ce cours.`);
        }

        return enrollment;
    }

    async updateProgress(courseId: string, supabaseId: string, progress: number) {
        const user = await this.prisma.user.findUnique({
            where: { supabaseId: supabaseId }
        });
        if (!user) {
            throw new NotFoundException(`Utilisateur introuvable.`);
        }

        const enrollment = await this.prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: courseId
                }
            }
        });
        if (!enrollment) {
            throw new NotFoundException(`Inscription introuvable pour ce cours.`);
        }

        return await this.prisma.enrollment.update({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: courseId
                }
            },
            data: {
                progress: progress,
                lastAccessed: new Date()
            }
        });
    }

    async remove(courseId: string, supabaseId: string) {
        const user = await this.prisma.user.findUnique({
            where: { supabaseId: supabaseId }
        });
        if (!user) {
            throw new NotFoundException(`Utilisateur introuvable.`);
        }

        const enrollment = await this.prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: courseId
                }
            }
        });
        if (!enrollment) {
            throw new NotFoundException(`Inscription introuvable pour ce cours.`);
        }

        return await this.prisma.enrollment.delete({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: courseId
                }
            }
        });
    }
}
