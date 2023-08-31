import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exercise, Project } from '../schemas';
import { Model, Types, UpdateQuery } from 'mongoose';
import { ProjectCreateDto } from '../dto/project-create.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private readonly ProjectModel: Model<Project>,
    @InjectModel(Exercise.name) private readonly ExerciseModel: Model<Exercise>,
  ) {}

  async create(dto: ProjectCreateDto) {
    const project = new this.ProjectModel({
      ...dto,
      exercises: [],
    });
    await project.save();

    const exercises = dto.exercises.map((ex) => new this.ExerciseModel(ex));
    await this.ExerciseModel.insertMany(exercises);

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
