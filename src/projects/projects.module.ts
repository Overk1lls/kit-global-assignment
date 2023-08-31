import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtHelperModule } from '../jwt-helper/jwt-helper.module';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Exercise, ExerciseSchema, Project, ProjectSchema } from '../schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: Exercise.name, schema: ExerciseSchema },
    ]),
    JwtHelperModule,
  ],
  providers: [ProjectsService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
