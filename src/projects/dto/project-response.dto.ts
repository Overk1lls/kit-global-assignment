import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsNumber, IsString } from 'class-validator';
import { ProjectCreateDto } from './project-create.dto';

export class ProjectsResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectCreateDto)
  projects: ProjectCreateDto[];

  @IsNumber()
  total: number;
}

export class ProjectUpdateResponseDto {
  @Type(() => ProjectCreateDto)
  project: ProjectCreateDto;

  @IsString()
  message: string;
}
