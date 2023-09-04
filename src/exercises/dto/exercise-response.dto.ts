import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsNumber, IsString } from 'class-validator';
import { ExerciseCreatedDto } from './exercise-create.dto';

export class ExercisesResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseCreatedDto)
  exercises: ExerciseCreatedDto[];

  @IsNumber()
  total: number;
}

export class ExerciseUpdateResponseDto {
  @Type(() => ExerciseCreatedDto)
  exercise: ExerciseCreatedDto;

  @IsString()
  message: string;
}
