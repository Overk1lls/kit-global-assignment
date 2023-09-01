import { IsArray, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ExerciseStatuses } from './exercise-update.dto';
import { StatusType } from '../exercises/exercises.types';
import { Type } from 'class-transformer';

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

export class ExerciseCreatedDto {
  @IsString()
  _id: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsIn(ExerciseStatuses)
  @IsString()
  status: StatusType;
}

export class ExerciseCreateResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseCreatedDto)
  exercises: ExerciseCreatedDto[];

  @IsNumber()
  total: number;
}
