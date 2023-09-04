import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { ProjectCreateDto } from './dto/project-create.dto';
import { Project } from './schemas';
import { Exercise } from '../exercises/schemas';
import { ProjectQueryDto } from './dto';

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

  async getAll(query: ProjectQueryDto) {
    const filter: FilterQuery<Project> = {};

    if (query.name) Object.assign(filter, { name: query.name });

    const projects = await this.ProjectModel.find(filter)
      .populate('exercises')
      .limit(query.limit)
      .skip(query.skip)
      .sort({ createdAt: query.createdAt })
      .exec();

    return projects.map((p) => p.toObject());
  }

  async getOneById(id: Types.ObjectId) {
    return await this.ProjectModel.findById(id).populate('exercises');
  }

  async updateOneById(id: Types.ObjectId, query: UpdateQuery<Project>) {
    const updatedProject = await this.ProjectModel.findByIdAndUpdate(id, query, { new: true, upsert: false });

    return updatedProject?.toObject();
  }

  async deleteOneById(id: Types.ObjectId) {
    const result = await this.ProjectModel.findByIdAndDelete(id);

    return result?.toObject();
  }
}
