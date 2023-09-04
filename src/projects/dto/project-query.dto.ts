import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto';

export class ProjectQueryDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsIn(['desc', 'descending', 'asc', 'ascending'])
  @IsString()
  @IsOptional()
  createdAt?: 'desc' | 'descending' | 'asc' | 'ascending';
}
