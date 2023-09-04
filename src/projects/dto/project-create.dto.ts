import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Exercise } from '../../exercises/schemas';
import { ExerciseStatuses } from '../../exercises/exercises.constants';

@ValidatorConstraint()
export class IsExerciseArray implements ValidatorConstraintInterface {
  validate(value: Exercise[], validationArguments?: ValidationArguments): boolean {
    return (
      Array.isArray(value) &&
      value.reduce(
        (a, b) =>
          a && typeof b.name === 'string' && typeof b.status === 'string' && ExerciseStatuses.includes(b.status),
        true,
      )
    );
  }
}

function formErrorMessage(validationArguments: ValidationArguments) {
  const { object } = validationArguments;
  // @ts-ignore
  const { exercises } = object;

  if (!exercises) return;

  const messagesArray = [];

  if (typeof exercises !== 'object') {
    messagesArray.push('The exercises array should contain objects.');
  }

  if (!('name' in exercises)) {
    messagesArray.push("The exercise object should have the 'name' property (string).");
  }

  if (!('status' in exercises)) {
    messagesArray.push("The exercise object should have the 'status' property ('Pending' | 'Progress' | 'Completed').");
  }

  return messagesArray.join(' ');
}

export class ProjectCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @Validate(IsExerciseArray, {
    message: (validationArguments) => formErrorMessage(validationArguments),
  })
  exercises: Exercise[];
}
