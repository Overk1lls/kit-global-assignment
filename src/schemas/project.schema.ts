import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Exercise } from './exercise.schema';

@Schema({ collection: 'projects', timestamps: true })
export class Project {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Exercise' }] })
  exercises: Exercise[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
