import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateQuery } from 'mongoose';
import { ProjectCreateDto } from './dto/project-create.dto';
import { Project } from './schemas';
import { Exercise } from '../exercises/schemas';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private readonly ProjectModel: Model<Project>,
    @InjectModel(Exercise.name) private readonly ExerciseModel: Model<Exercise>,
  ) {}

  async create(dto: ProjectCreateDto) {
    const project = await this.ProjectModel.create({
      ...dto,
      exercises: [],
    });

    const exercises = await this.ExerciseModel.insertMany(dto.exercises);

    return await this.ProjectModel.findByIdAndUpdate(project._id, { $push: { exercises } }, { new: true });
  }

  async getAll() {
    return await this.ProjectModel.find().populate('exercises');
  }

  async getOneById(id: Types.ObjectId) {
    return await this.ProjectModel.findById(id).populate('exercises');
  }

  async updateOneById(id: Types.ObjectId, query: UpdateQuery<Project>) {
    const exercise = await this.ProjectModel.findByIdAndUpdate(id, query, { new: true, upsert: false });

    if (!exercise) {
      throw new BadRequestException('Project with such id is not found!');
    }

    return exercise.toObject();
  }

  async deleteOneById(id: Types.ObjectId) {
    const result = await this.ProjectModel.findByIdAndDelete(id);

    if (!result) {
      throw new BadRequestException('Such exercise not found!');
    }

    return result.toObject();
  }
}
