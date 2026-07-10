import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DtoPayment } from './dtocreatepay';

@Injectable()
export class PaymentService {
    constructor(private Prisma:PrismaService){}

        async create(supabaseId: string, courseId: string, dto: DtoPayment) {
                const user = await this.Prisma.user.findUnique({
                    where: {
                    supabaseId,
                    },
                });

                if (!user) {
                    throw new NotFoundException('Utilisateur introuvable');
                }

                const course = await this.Prisma.course.findUnique({
                    where: {
                    id: courseId,
                    },
                });

                if (!course) {
                    throw new NotFoundException('Cours introuvable');
                }

                return await this.Prisma.payment.create({
                        data: {
                        userId: user.id,
                        courseId: course.id,
                        amount: dto.amount,
                        operator: dto.operator,
                        phoneNumber: dto.phoneNumber,
                        },
                });
        }

        async findAll() {
                return await this.Prisma.payment.findMany();
        }
        async findOne(id: string) {
                return await this.Prisma.payment.findUnique({
                        where: {
                        id,
                        },
                });
        }

        async update(
                supabaseId: string,
                paymentId: string,
                dto:DtoPayment,
                ) {
                const user = await this.Prisma.user.findUnique({
                    where: {
                    supabaseId,
                    },
                });

                if (!user) {
                    throw new NotFoundException('Utilisateur introuvable');
                }

                const payment = await this.Prisma.payment.findFirst({
                    where: {
                    id: paymentId,
                    userId: user.id,
                    },
                });

                if (!payment) {
                    throw new NotFoundException('Paiement introuvable');
                }

                return await this.Prisma.payment.update({
                    where: {
                    id: paymentId,
                    },
                    data: {
                    amount: dto.amount,
                    operator: dto.operator,
                    phoneNumber: dto.phoneNumber,
                    status: dto.status,
                    transactionId: dto.transactionId,
                    },
                });
                }

}
