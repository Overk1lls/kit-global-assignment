import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Exercise } from '../schemas';
import { ExerciseCreateDto } from '../dto';

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
    return exercise.toObject();
  }

  async getAll() {
    const exercises = await this.ExerciseModel.find();
    return exercises.map((ex) => ex.toObject());
  }

  async getTotal() {
    return await this.ExerciseModel.countDocuments();
  }
}
