import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { JwtHelperService } from '../jwt-helper/jwt-helper.service';
import { mockJwtHelperService, mockObjectIdString, mockProject, mockProjectsService } from '../../test/mocks';

describe('ProjectsController', () => {
  let controller: ProjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: mockProjectsService,
        },
        {
          provide: JwtHelperService,
          useValue: mockJwtHelperService,
        },
      ],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
  });

  describe('create()', () => {
    it('should be created', async () => {
      const project = await controller.createOne(mockProject);

      expect(project).toEqual(mockProject);
    });
  });

  describe('getProjects()', () => {
    it('should get all projects', async () => {
      const projects = await controller.getProjects();

      expect(projects).toHaveLength(1);
      expect(projects[0]).toEqual(mockProject);
    });
  });

  describe('getProjectById()', () => {
    it('should get a project by id', async () => {
      const project = await controller.getProjectById(mockObjectIdString);

      expect(project).toEqual(mockProject);
    });

    it('should throw an error', async () => {
      const invokeFn = async () => await controller.getProjectById('123');

      expect(invokeFn).rejects.toThrowError(BadRequestException);
    });
  });

  describe('updateProjectById()', () => {
    it('should update a project by id', async () => {
      const project = await controller.updateProjectById(mockObjectIdString, mockProject);

      expect(project).toEqual({
        message: 'Sucessfully updated!',
        project: mockProject,
      });
    });

    it('should throw an error', async () => {
      const invokeFn = async () => await controller.updateProjectById('123', mockProject);

      expect(invokeFn).rejects.toThrowError(BadRequestException);
    });

    it('should throw an error (nothing to update)', async () => {
      const invokeFn = async () => await controller.updateProjectById(mockObjectIdString, {});

      expect(invokeFn).rejects.toThrowError(BadRequestException);
    });
  });

  describe('deleteProjectById()', () => {
    it('should delete a project by id', async () => {
      await controller.deleteProjectById(mockObjectIdString);

      expect(mockProjectsService.deleteOneById).toHaveBeenCalled();
    });

    it('should throw an error', async () => {
      const invokeFn = async () => await controller.deleteProjectById('123');

      expect(invokeFn).rejects.toThrowError(BadRequestException);
    });
  });
});
