import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { StatusType } from '../exercises.types';
import { ExerciseStatuses } from '../exercises.constants';
import { Project } from '../../projects/schemas';

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

  @IsString()
  project: Project;
}
