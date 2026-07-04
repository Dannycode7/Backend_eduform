import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { EnrollmentModule } from './enrollment/enrollment.module';



@Module({
  imports: [
   ConfigModule.forRoot({
      isGlobal: true,
    }),
  PrismaModule, SupabaseModule, AuthModule, UserModule, CourseModule, EnrollmentModule],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
