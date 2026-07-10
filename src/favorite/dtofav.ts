import { IsInt, IsUUID } from 'class-validator';

export class DtoFavorite {
  @IsInt()
  userId!: number;

  @IsUUID()
  courseId!: string;
}