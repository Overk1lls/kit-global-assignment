import { Transform } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Exercise } from '../../exercises/schemas/exercise.schema';

export type ProjectDocument = Project & Document;

@Schema({ collection: 'projects', timestamps: true, versionKey: false })
export class Project {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Exercise' }] })
  exercises: Exercise[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
