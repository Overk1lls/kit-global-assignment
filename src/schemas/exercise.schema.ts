import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { StatusType } from '../exercises/exercises.types';
import { Project } from './project.schema';

@Schema({ collection: 'exercises', timestamps: true })
export class Exercise {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  status: StatusType;

  @Prop({ type: Types.ObjectId, ref: 'Project' })
  project: Project;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
