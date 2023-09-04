import { IsIn, IsOptional, IsString } from 'class-validator';
import { StatusType } from '../exercises.types';
import { ExerciseStatuses } from '../exercises.constants';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

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
