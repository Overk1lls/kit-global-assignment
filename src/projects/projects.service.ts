import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Exercise, Project } from '../schemas';
import { Model } from 'mongoose';
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
    const projects = await this.ProjectModel.find().populate('exercises', '', this.ExerciseModel);
    return projects.map((p) => p.toObject());
  }
}
