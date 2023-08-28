import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
}
