import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Body,
  Get,
  Param,
  BadRequestException,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Types, isValidObjectId } from 'mongoose';
import { ExercisesService } from './exercises.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExerciseCreateDto, ExerciseQueryDto, ExerciseUpdateDto } from '../dto';

@ApiTags('exercises')
@ApiBearerAuth()
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createOne(@Body() dto: ExerciseCreateDto) {
    return await this.exercisesService.create(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getExercises(@Query() query: ExerciseQueryDto) {
    const exercises = await this.exercisesService.getAll(query);

    return {
      exercises,
      total: exercises.length,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getExerciseById(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id');
    }

    return await this.exercisesService.getOneById(new Types.ObjectId(id));
  }

  @HttpCode(HttpStatus.OK)
  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateExerciseById(@Param('id') id: string, @Body() dto: ExerciseUpdateDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id');
    }

    if (Object.values(dto).every((v) => !v)) {
      throw new BadRequestException('Nothing to update!');
    }

    return {
      message: 'Successfully updated!',
      exercise: await this.exercisesService.updateOneById(new Types.ObjectId(id), dto),
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteExerciseById(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id');
    }

    await this.exercisesService.deleteOneById(new Types.ObjectId(id));
  }
}
