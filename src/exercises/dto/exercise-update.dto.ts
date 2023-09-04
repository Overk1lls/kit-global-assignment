import { IsIn, IsOptional, IsString } from 'class-validator';
import { StatusType } from '../exercises.types';
import { ExerciseStatuses } from '../exercises.constants';

export class ExerciseUpdateDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @IsIn(ExerciseStatuses)
  status?: StatusType;

  @IsString()
  @IsOptional()
  project?: string;
}
