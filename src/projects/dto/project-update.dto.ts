import { IsOptional, IsString } from 'class-validator';

export class ProjectUpdateDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
