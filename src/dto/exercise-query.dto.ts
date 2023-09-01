import { IsIn, IsOptional, IsString } from 'class-validator';
import { StatusType } from '../exercises/exercises.types';
import { PaginationQueryDto } from './pagination-query.dto';
import { ExerciseStatuses } from './exercise-update.dto';

export class ExerciseQueryDto extends PaginationQueryDto {
  @IsIn(ExerciseStatuses)
  @IsString()
  @IsOptional()
  status?: StatusType;

  @IsIn(['desc', 'descending', 'asc', 'ascending'])
  @IsString()
  @IsOptional()
  createdAt?: 'desc' | 'descending' | 'asc' | 'ascending';

  @IsString()
  @IsOptional()
  project?: string;
}
