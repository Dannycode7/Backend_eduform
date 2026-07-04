import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Min } from 'class-validator';
import { Category, Difficulty } from '@prisma/client'; // Importez vos enums Prisma

export class Dtocreatecourse {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsEnum(Category)
    @IsNotEmpty()
    category!: Category;

    @IsEnum(Difficulty)
    @IsNotEmpty()
    difficulty!: Difficulty;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsUrl()
    @IsOptional() // Optionnel car il y a une valeur par défaut dans Prisma
    image?: string;

    @IsString()
    @IsNotEmpty()
    duration!: string;

    @IsString()
    @IsNotEmpty()
    instructor!: string;

    @IsNumber()
    @Min(0)
    @IsOptional() // Optionnel car par défaut à 0.0
    price?: number;
}
