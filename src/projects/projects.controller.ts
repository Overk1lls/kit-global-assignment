import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Types, isValidObjectId } from 'mongoose';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectCreateDto, ProjectUpdateDto } from './dto';

@ApiTags('projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createOne(@Body() dto: ProjectCreateDto) {
    return await this.projectsService.create(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getProjects() {
    return await this.projectsService.getAll();
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getProjectById(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id');
    }

    return await this.projectsService.getOneById(new Types.ObjectId(id));
  }

  @HttpCode(HttpStatus.OK)
  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateProjectById(@Param('id') id: string, @Body() dto: ProjectUpdateDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id');
    }

    if (Object.values(dto).every((v) => !v)) {
      throw new BadRequestException('Nothing to update!');
    }

    return {
      message: 'Sucessfully updated!',
      project: await this.projectsService.updateOneById(new Types.ObjectId(id), dto),
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteProjectById(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id');
    }

    await this.projectsService.deleteOneById(new Types.ObjectId(id));
  }
}
