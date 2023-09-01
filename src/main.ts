import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Kit Global Test Assignment')
    .setDescription('A test assignment for the Kit Global company.')
    .setVersion('1.0')
    .addTag('auth', 'Authorization and Authentication')
    .addTag('exercises', 'Exercises-related endpoints')
    .addTag('projects', 'Projects-related endpoints')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/v1', app, document);

  await app.listen(3000);
}

bootstrap().catch(console.error);
