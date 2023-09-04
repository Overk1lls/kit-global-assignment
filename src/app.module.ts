import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './common/mongoose-config/mongoose-config.service';
import { JwtHelperModule } from './jwt-helper/jwt-helper.module';
import { ExercisesModule } from './exercises/exercises.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { ExercisesMiddleware } from './exercises/exercises.middleware';
import { ProjectsMiddleware } from './projects/projects.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    JwtHelperModule,
    AuthModule,
    UsersModule,
    ExercisesModule,
    ProjectsModule,
  ],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExercisesMiddleware).forRoutes('exercises');
    consumer.apply(ProjectsMiddleware).forRoutes('projects');
  }
}
