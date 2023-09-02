import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';
import { JwtHelperService } from '../jwt-helper/jwt-helper.service';
import { ExerciseCreateDto } from '../dto';
import {
  mockExercise,
  mockExercisesService,
  mockJwtHelperService,
  mockObjectIdString,
  mockRequest,
} from '../../test/mocks';

describe('ExercisesController', () => {
  let controller: ExercisesController;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [ExercisesController],
      providers: [
        {
          provide: ExercisesService,
          useValue: mockExercisesService,
        },
        {
          provide: JwtHelperService,
          useValue: mockJwtHelperService,
        },
      ],
    }).compile();

    controller = moduleRef.get<ExercisesController>(ExercisesController);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('should create an exercise', async () => {
    const exercise = await controller.createOne(mockRequest, mockExercise as any as ExerciseCreateDto);

    expect(exercise).toEqual(mockExercise);
  });

  it('should get a list of exercises', async () => {
    const result = await controller.getExercises(mockRequest, {});

    expect(result.total).toBe(result.exercises.length);
    expect(result.exercises).toHaveLength(result.total);
    expect(result.exercises[0]).toEqual(mockExercise);
  });

  describe('getExerciseById()', () => {
    it('should get an exercise by id', async () => {
      const exercise = await controller.getExerciseById(mockRequest, mockObjectIdString);

      expect(exercise).toEqual(mockExercise);
    });

    it('should throw the invalid id error', async () => {
      const getExercise = async () => await controller.getExerciseById(mockRequest, '123');

      expect(() => getExercise()).rejects.toThrowError(BadRequestException);
    });
  });

  describe('updateExerciseById()', () => {
    it('should update an exercise by id', async () => {
      const exercise = await controller.updateExerciseById(mockRequest, mockObjectIdString, { name: 'test-2' });

      expect(exercise).toEqual({
        message: 'Successfully updated!',
        exercise: mockExercise,
      });
    });

    it('should throw the nothing to update error', async () => {
      const getExercise = async () => await controller.updateExerciseById(mockRequest, mockObjectIdString, {});

      expect(() => getExercise()).rejects.toThrowError(BadRequestException);
    });

    it('should throw the invalid id error', async () => {
      const getExercise = async () => await controller.updateExerciseById(mockRequest, '123', {});

      expect(() => getExercise()).rejects.toThrowError(BadRequestException);
    });
  });

  describe('deleteExerciseById()', () => {
    it('should delete an exercise by id', async () => {
      await controller.deleteExerciseById(mockRequest, mockObjectIdString);

      expect(mockExercisesService.deleteOneById).toHaveBeenCalled();
    });

    it('should throw the invalid id error', async () => {
      const getExercise = async () => await controller.deleteExerciseById(mockRequest, '123');

      expect(() => getExercise()).rejects.toThrowError(BadRequestException);
    });
  });
});
