import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ExerciseCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  project?: string;
}
