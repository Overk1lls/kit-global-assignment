import { Test, TestingModule } from '@nestjs/testing';
import { ExercisesService } from './exercises.service';
import { getModelToken } from '@nestjs/mongoose';
import { Exercise } from '../schemas';
import { mockExercise, mockExerciseModel, mockObjectId } from '../../test/mocks';
import { ExerciseCreateDto } from '../dto';
import { BadRequestException } from '@nestjs/common';

describe('ExercisesService', () => {
  let exercisesService: ExercisesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExercisesService,
        {
          provide: getModelToken(Exercise.name),
          useValue: mockExerciseModel,
        },
      ],
    }).compile();

    exercisesService = module.get<ExercisesService>(ExercisesService);
  });

  describe('create()', () => {
    it('should create an exercise', async () => {
      const exercise = await exercisesService.create(mockExercise as any as ExerciseCreateDto);

      expect(exercise).toEqual(mockExercise);
    });
  });

  describe('getOneById()', () => {
    it('should find an exercise by id', async () => {
      const exercise = await exercisesService.getOneById(mockObjectId);

      expect(exercise).toEqual(mockExercise);
    });
  });

  describe('getAll()', () => {
    it('should find all exercises', async () => {
      const exercise = await exercisesService.getAll({ project: '123', status: 'Completed' });

      expect(exercise[0]).toEqual(mockExercise);
    });
  });

  describe('updateOneById()', () => {
    it('should update an exercise by id', async () => {
      const exercise = await exercisesService.updateOneById(mockObjectId, {});

      expect(exercise).toEqual(mockExercise);
    });

    it('should throw an error', async () => {
      mockExerciseModel.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(undefined);

      const invokeFn = async () => await exercisesService.updateOneById(mockObjectId, {});

      expect(invokeFn).rejects.toThrowError(BadRequestException);
    });
  });

  describe('deleteOneById()', () => {
    it('should delete an exercise by id', async () => {
      await exercisesService.deleteOneById(mockObjectId);

      expect(mockExerciseModel.findByIdAndDelete).toHaveBeenCalled();
    });

    it('should throw an error', async () => {
      mockExerciseModel.findByIdAndDelete = jest.fn().mockResolvedValueOnce(undefined);

      const invokeFn = async () => await exercisesService.deleteOneById(mockObjectId);

      expect(invokeFn).rejects.toThrowError(BadRequestException);
    });
  });
});
