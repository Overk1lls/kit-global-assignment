import { Transform } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { StatusType } from '../exercises.types';
import { ExerciseStatuses } from '../exercises.constants';
import { Project } from '../../projects/schemas/project.schema';

export type ExerciseDocument = Exercise & Document;

@Schema({ collection: 'exercises', timestamps: true, versionKey: false })
export class Exercise {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true, enum: ExerciseStatuses })
  status: StatusType;

  @Prop({ type: Types.ObjectId, ref: 'Project' })
  project: Project;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
