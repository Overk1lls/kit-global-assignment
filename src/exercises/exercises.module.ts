import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtHelperModule } from '../jwt-helper/jwt-helper.module';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { Exercise, ExerciseSchema } from '../schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Exercise.name, schema: ExerciseSchema }]),
    JwtHelperModule,
  ],
  providers: [ExercisesService],
  controllers: [ExercisesController],
})
export class ExercisesModule {}
