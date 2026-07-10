import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { MobileOperator, PaymentStatus } from '@prisma/client';

export class DtoPayment {
  @IsInt()
  userId?: number;

  @IsUUID()
  courseId?: string;

  @IsNumber()
  @Min(0)
  amount!: number;

  @IsEnum(MobileOperator)
  operator!: MobileOperator;

  @IsString()
  phoneNumber!: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsString()
  transactionId?: string;
}