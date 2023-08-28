import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { JwtHelperService } from '../jwt-helper/jwt-helper.service';
import { Exercise, ExerciseSchema } from '../schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: Exercise.name, schema: ExerciseSchema }])],
  providers: [ExercisesService, JwtService, JwtHelperService],
  controllers: [ExercisesController],
})
export class ExercisesModule {}
