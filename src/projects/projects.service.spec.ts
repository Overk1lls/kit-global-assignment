import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ProjectsService } from './projects.service';
import { Project } from './schemas';
import { Exercise } from '../exercises/schemas';
import { ProjectCreateDto } from './dto';
import { mockExercise, mockExerciseModel, mockObjectId, mockProject, mockProjectModel } from '../../test/mocks';

describe('ProjectsService', () => {
  let moduleRef: TestingModule;
  let service: ProjectsService;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
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

    service = moduleRef.get<ProjectsService>(ProjectsService);
  });

  afterAll(async () => {
    await moduleRef.close();
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
  });

  describe('deleteOneById()', () => {
    it('should delete a project by id', async () => {
      await service.deleteOneById(mockObjectId);

      expect(mockProjectModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });
});
