import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { Types, isValidObjectId } from 'mongoose';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiErrorDescription } from '../common/enum';
import {
  ProjectCreateDto,
  ProjectQueryDto,
  ProjectUpdateDto,
  ProjectUpdateResponseDto,
  ProjectsResponseDto,
} from './dto';

@ApiTags('projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createOne(@Body() dto: ProjectCreateDto): Promise<ProjectCreateDto> {
    return await this.projectsService.create(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getProjects(@Query() query: ProjectQueryDto): Promise<ProjectsResponseDto> {
    const projects = await this.projectsService.getAll(query);

    return {
      projects,
      total: projects.length,
    };
  }

  @ApiBadRequestResponse({ description: ApiErrorDescription.INVALID_ID })
  @ApiNotFoundResponse({ description: ApiErrorDescription.NOT_FOUND })
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getProjectById(@Param('id') id: string): Promise<ProjectCreateDto> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(ApiErrorDescription.INVALID_ID);
    }

    const project = await this.projectsService.getOneById(new Types.ObjectId(id));
    if (!project) {
      throw new NotFoundException(ApiErrorDescription.NOT_FOUND);
    }

    return project;
  }

  @ApiBadRequestResponse({ description: ApiErrorDescription.INVALID_ID })
  @ApiBadRequestResponse({ description: ApiErrorDescription.NOTHING_TO_UPDATE })
  @ApiNotFoundResponse({ description: ApiErrorDescription.NOT_FOUND })
  @HttpCode(HttpStatus.OK)
  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateProjectById(@Param('id') id: string, @Body() dto: ProjectUpdateDto): Promise<ProjectUpdateResponseDto> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(ApiErrorDescription.INVALID_ID);
    }

    if (Object.values(dto).every((v) => !v)) {
      throw new BadRequestException(ApiErrorDescription.NOTHING_TO_UPDATE);
    }

    const updatedProject = await this.projectsService.updateOneById(new Types.ObjectId(id), dto);
    if (!updatedProject) {
      throw new NotFoundException(ApiErrorDescription.NOT_FOUND);
    }

    return {
      message: 'Sucessfully updated!',
      project: updatedProject,
    };
  }

  @ApiBadRequestResponse({ description: ApiErrorDescription.INVALID_ID })
  @ApiNotFoundResponse({ description: ApiErrorDescription.NOT_FOUND })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteProjectById(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(ApiErrorDescription.INVALID_ID);
    }

    const deletedProject = await this.projectsService.deleteOneById(new Types.ObjectId(id));
    if (!deletedProject) {
      throw new NotFoundException(ApiErrorDescription.NOT_FOUND);
    }
  }
}
