import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { Exercise } from '../schemas';
import { ExerciseCreateDto, ExerciseQueryDto } from '../dto';

@Injectable()
export class ExercisesService {
  constructor(@InjectModel(Exercise.name) private readonly ExerciseModel: Model<Exercise>) {}

  async create(dto: ExerciseCreateDto) {
    const document = new this.ExerciseModel({
      ...dto,
      status: 'Pending',
    });
    const saveResult = await document.save();

    return saveResult.toObject();
  }

  async getOneById(id: Types.ObjectId) {
    const exercise = await this.ExerciseModel.findById(id);
    return exercise?.toObject();
  }

  async getAll(query: ExerciseQueryDto) {
    const filter: FilterQuery<Exercise> = {};

    if (query.project) Object.assign(filter, { project: query.project });
    if (query.status) Object.assign(filter, { status: query.status });

    const exercises = await this.ExerciseModel.find(filter)
      .limit(query.limit)
      .skip(query.skip)
      .sort({ updatedAt: query.createdAt })
      .exec();

    return exercises.map((ex) => ex.toObject());
  }

  async updateOneById(id: Types.ObjectId, query: UpdateQuery<Exercise>) {
    const exercise = await this.ExerciseModel.findByIdAndUpdate(id, query, { new: true, upsert: false });

    if (!exercise) {
      throw new BadRequestException('Such exercise not found!');
    }

    return exercise.toObject();
  }

  async deleteOneById(id: Types.ObjectId) {
    const result = await this.ExerciseModel.findByIdAndDelete(id);

    if (!result) {
      throw new BadRequestException('Such exercise not found!');
    }

    return result.toObject();
  }
}
