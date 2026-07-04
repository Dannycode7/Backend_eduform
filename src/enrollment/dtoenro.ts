import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class Dtocreateenr {
    @IsUUID(4) 
    @IsNotEmpty()
    userId!: string; 

    @IsUUID(4) 
    @IsNotEmpty()
    courseId!: string;

    @IsInt()
    @Min(0)
    @Max(100)
    @IsOptional()
    progress?: number;
}
