import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Body,
  Req,
  Get,
  Param,
  BadRequestException,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { AuthGuard } from '../auth/auth.guard';
import { ExerciseCreateDto, ExerciseQueryDto, ExerciseUpdateDto } from '../dto';
import { Request } from 'express';
import { JwtPayload } from '../interfaces';
import { JwtHelperService } from '../jwt-helper/jwt-helper.service';
import { JwtBearerScope } from '../jwt-helper/jwt-helper.enum';
import { Types, isValidObjectId } from 'mongoose';

@Controller('exercises')
export class ExercisesController {
  constructor(
    private readonly exercisesService: ExercisesService,
    private readonly jwtHelperService: JwtHelperService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @UseGuards(AuthGuard)
  async createOne(@Req() req: Request & { user: JwtPayload }, @Body() dto: ExerciseCreateDto) {
    this.jwtHelperService.assertRequiredScopes([JwtBearerScope.ExercisesCreate], req.user.scopes);

    return await this.exercisesService.create(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/')
  @UseGuards(AuthGuard)
  async getExercises(@Req() req: Request & { user: JwtPayload }, @Query() query: ExerciseQueryDto) {
    this.jwtHelperService.assertRequiredScopes([JwtBearerScope.ExercisesRead], req.user.scopes);

    const exercises = await this.exercisesService.getAll(query);

    return {
      exercises,
      total: exercises.length,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  @UseGuards(AuthGuard)
  async getExerciseById(@Req() req: Request & { user: JwtPayload }, @Param('id') id: string) {
    this.jwtHelperService.assertRequiredScopes([JwtBearerScope.ExercisesRead], req.user.scopes);

    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id');
    }

    return await this.exercisesService.getOneById(new Types.ObjectId(id));
  }

  @HttpCode(HttpStatus.OK)
  @Patch('/:id')
  @UseGuards(AuthGuard)
  async updateExerciseById(
    @Req() req: Request & { user: JwtPayload },
    @Param('id') id: string,
    @Body() dto: ExerciseUpdateDto,
  ) {
    this.jwtHelperService.assertRequiredScopes([JwtBearerScope.ExercisesUpdate], req.user.scopes);

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
  @UseGuards(AuthGuard)
  async deleteExerciseById(@Req() req: Request & { user: JwtPayload }, @Param('id') id: string) {
    this.jwtHelperService.assertRequiredScopes([JwtBearerScope.ExercisesDelete], req.user.scopes);

    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id');
    }

    await this.exercisesService.deleteOneById(new Types.ObjectId(id));
  }
}
