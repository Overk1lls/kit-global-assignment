import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { Exercise } from './schemas';
import { ExerciseCreateDto, ExerciseQueryDto } from './dto';

@Injectable()
export class ExercisesService {
  constructor(@InjectModel(Exercise.name) private readonly exerciseModel: Model<Exercise>) {}

  async create(dto: ExerciseCreateDto) {
    const document = await this.exerciseModel.create({
      ...dto,
      status: 'Pending',
    });

    return document.toObject();
  }

  async getOneById(id: Types.ObjectId) {
    const exercise = await this.exerciseModel.findById(id);

    return exercise?.toObject();
  }

  async getAll(query: ExerciseQueryDto) {
    const filter: FilterQuery<Exercise> = {};

    if (query.project) Object.assign(filter, { project: query.project });
    if (query.status) Object.assign(filter, { status: query.status });

    const exercises = await this.exerciseModel
      .find(filter)
      .limit(query.limit)
      .skip(query.skip)
      .sort({ updatedAt: query.createdAt })
      .exec();

    return exercises.map((ex) => ex.toObject());
  }

  async updateOneById(id: Types.ObjectId, query: UpdateQuery<Exercise>) {
    const exercise = await this.exerciseModel.findByIdAndUpdate(id, query, { new: true, upsert: false });

    return exercise?.toObject();
  }

  async deleteOneById(id: Types.ObjectId) {
    const result = await this.exerciseModel.findByIdAndDelete(id);

    return result?.toObject();
  }
}
