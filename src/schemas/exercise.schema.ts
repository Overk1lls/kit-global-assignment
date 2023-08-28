import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { StatusType } from '../exercises/exercises.types';

@Schema({ collection: 'exercises' })
export class Exercise {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  status: StatusType;

  @Prop()
  project: string;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
