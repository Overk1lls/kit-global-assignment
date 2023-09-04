import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ExercisesService } from './exercises.service';
import { Exercise } from './schemas';
import { ExerciseCreateDto } from './dto';
import { mockExercise, mockExerciseModel, mockObjectId } from '../../test/mocks';

describe('ExercisesService', () => {
  let moduleRef: TestingModule;
  let service: ExercisesService;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        ExercisesService,
        {
          provide: getModelToken(Exercise.name),
          useValue: mockExerciseModel,
        },
      ],
    }).compile();

    service = moduleRef.get<ExercisesService>(ExercisesService);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe('create()', () => {
    it('should create an exercise', async () => {
      const exercise = await service.create(mockExercise as any as ExerciseCreateDto);

      expect(exercise).toEqual(mockExercise);
    });
  });

  describe('getOneById()', () => {
    it('should find an exercise by id', async () => {
      const exercise = await service.getOneById(mockObjectId);

      expect(exercise).toEqual(mockExercise);
    });
  });

  describe('getAll()', () => {
    it('should find all exercises', async () => {
      const exercise = await service.getAll({ project: '123', status: 'Completed' });

      expect(exercise[0]).toEqual(mockExercise);
    });
  });

  describe('updateOneById()', () => {
    it('should update an exercise by id', async () => {
      const exercise = await service.updateOneById(mockObjectId, {});

      expect(exercise).toEqual(mockExercise);
    });
  });

  describe('deleteOneById()', () => {
    it('should delete an exercise by id', async () => {
      await service.deleteOneById(mockObjectId);

      expect(mockExerciseModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });
});
