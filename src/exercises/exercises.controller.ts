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
  NotFoundException,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { Types, isValidObjectId } from 'mongoose';
import { ExercisesService } from './exercises.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ExerciseCreateDto,
  ExercisesResponseDto,
  ExerciseCreatedDto,
  ExerciseQueryDto,
  ExerciseUpdateDto,
  ExerciseUpdateResponseDto,
} from './dto';
import { ApiErrorDescription } from '../common/enum';

@ApiTags('exercises')
@ApiBearerAuth()
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createOne(@Body() dto: ExerciseCreateDto): Promise<ExerciseCreatedDto> {
    return await this.exercisesService.create(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getExercises(@Query() query: ExerciseQueryDto): Promise<ExercisesResponseDto> {
    const exercises = await this.exercisesService.getAll(query);

    return {
      exercises,
      total: exercises.length,
    };
  }

  @ApiBadRequestResponse({ description: ApiErrorDescription.INVALID_ID })
  @ApiNotFoundResponse({ description: ApiErrorDescription.NOT_FOUND })
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getExerciseById(@Param('id') id: string): Promise<ExerciseCreatedDto> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(ApiErrorDescription.INVALID_ID);
    }

    const exercise = await this.exercisesService.getOneById(new Types.ObjectId(id));
    if (!exercise) {
      throw new NotFoundException(ApiErrorDescription.NOT_FOUND);
    }

    return exercise;
  }

  @ApiBadRequestResponse({ description: ApiErrorDescription.INVALID_ID })
  @ApiBadRequestResponse({ description: ApiErrorDescription.NOTHING_TO_UPDATE })
  @ApiNotFoundResponse({ description: ApiErrorDescription.NOT_FOUND })
  @HttpCode(HttpStatus.OK)
  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateExerciseById(
    @Param('id') id: string,
    @Body() dto: ExerciseUpdateDto,
  ): Promise<ExerciseUpdateResponseDto> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(ApiErrorDescription.INVALID_ID);
    }

    if (Object.values(dto).every((v) => !v)) {
      throw new BadRequestException(ApiErrorDescription.NOTHING_TO_UPDATE);
    }

    const updatedEx = await this.exercisesService.updateOneById(new Types.ObjectId(id), dto);
    if (!updatedEx) {
      throw new NotFoundException(ApiErrorDescription.NOT_FOUND);
    }

    return {
      message: 'Successfully updated!',
      exercise: updatedEx,
    };
  }

  @ApiBadRequestResponse({ description: ApiErrorDescription.INVALID_ID })
  @ApiBadRequestResponse({ description: ApiErrorDescription.NOTHING_TO_UPDATE })
  @ApiNotFoundResponse({ description: ApiErrorDescription.NOT_FOUND })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteExerciseById(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(ApiErrorDescription.INVALID_ID);
    }

    const deletedEx = await this.exercisesService.deleteOneById(new Types.ObjectId(id));
    if (!deletedEx) {
      throw new NotFoundException(ApiErrorDescription.NOT_FOUND);
    }
  }
}
