import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Body,
  Req,
  Get,
} from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { AuthGuard } from '../auth/auth.guard';
import { ExerciseCreateDto } from '../dto';
import { Request } from 'express';
import { JwtPayload } from '../interfaces';
import { JwtHelperService } from '../jwt-helper/jwt-helper.service';
import { JwtBearerScope } from '../jwt-helper/jwt-helper.enum';

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
}
