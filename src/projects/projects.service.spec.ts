import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { getModelToken } from '@nestjs/mongoose';
import { Exercise, Project } from '../schemas';
import { mockExercise, mockExerciseModel, mockObjectId, mockProject, mockProjectModel } from '../../test/mocks';
import { ProjectCreateDto } from '../dto';
import { BadRequestException } from '@nestjs/common';

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getModelToken(Project.name),
          useValue: mockProjectModel,
        },
        {
          provide: getModelToken(Exercise.name),
          useValue: mockExerciseModel,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  describe('create()', () => {
    it('should create a project', async () => {
      const project = await service.create({
        ...mockProject,
        exercises: [mockExercise],
      } as any as ProjectCreateDto);

      expect(project.toObject()).toEqual(mockProject);
    });
  });

  describe('getOneById()', () => {
    it('should find a project by id', async () => {
      const project = await service.getOneById(mockObjectId);
      const { _id, name, description } = mockProject;

      expect(project).toEqual(expect.objectContaining({ _id, name, description }));
    });
  });

  describe('getAll()', () => {
    it('should find all projects', async () => {
      const projects = await service.getAll();
      const { _id, name, description } = mockProject;

      expect(projects).toEqual(expect.objectContaining({ _id, name, description }));
    });
  });

  describe('updateOneById()', () => {
    it('should update a project by id', async () => {
      const project = await service.updateOneById(mockObjectId, {});

      expect(project).toEqual(mockProject);
    });

    it('should throw an error', async () => {
      mockProjectModel.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(undefined);

      const invokeFn = async () => await service.updateOneById(mockObjectId, {});

      expect(invokeFn).rejects.toThrowError(BadRequestException);
    });
  });

  describe('deleteOneById()', () => {
    it('should delete a project by id', async () => {
      await service.deleteOneById(mockObjectId);

      expect(mockProjectModel.findByIdAndDelete).toHaveBeenCalled();
    });

    it('should throw an error', async () => {
      mockProjectModel.findByIdAndDelete = jest.fn().mockResolvedValueOnce(undefined);

      const invokeFn = async () => await service.deleteOneById(mockObjectId);

      expect(invokeFn).rejects.toThrowError(BadRequestException);
    });
  });
});
