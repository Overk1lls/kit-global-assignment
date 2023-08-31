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
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ProjectsService } from './projects.service';
import { JwtHelperService } from '../jwt-helper/jwt-helper.service';
import { JwtBearerScope } from '../jwt-helper/jwt-helper.enum';
import { AuthGuard } from '../auth/auth.guard';
import { JwtPayload } from '../interfaces';
import { ProjectCreateDto } from '../dto/project-create.dto';
import { Types, isValidObjectId } from 'mongoose';
import { ProjectUpdateDto } from '../dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService, private readonly jwtHelperService: JwtHelperService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @UseGuards(AuthGuard)
  async createOne(@Req() req: Request & { user: JwtPayload }, @Body() dto: ProjectCreateDto) {
    this.jwtHelperService.assertRequiredScopes([JwtBearerScope.ProjectsCreate], req.user.scopes);

    return await this.projectsService.create(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/')
  @UseGuards(AuthGuard)
  async getProjects(@Req() req: Request & { user: JwtPayload }) {
    this.jwtHelperService.assertRequiredScopes([JwtBearerScope.ProjectsRead], req.user.scopes);

    return await this.projectsService.getAll();
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  @UseGuards(AuthGuard)
  async getProjectById(@Req() req: Request & { user: JwtPayload }, @Param('id') id: string) {
    this.jwtHelperService.assertRequiredScopes([JwtBearerScope.ProjectsRead], req.user.scopes);

    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id');
    }

    return await this.projectsService.getOneById(new Types.ObjectId(id));
  }

  @HttpCode(HttpStatus.OK)
  @Patch('/:id')
  @UseGuards(AuthGuard)
  async updateProjectById(
    @Req() req: Request & { user: JwtPayload },
    @Param('id') id: string,
    @Body() dto: ProjectUpdateDto,
  ) {
    this.jwtHelperService.assertRequiredScopes([JwtBearerScope.ProjectsUpdate], req.user.scopes);

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
  @UseGuards(AuthGuard)
  async deleteProjectById(@Req() req: Request & { user: JwtPayload }, @Param('id') id: string) {
    this.jwtHelperService.assertRequiredScopes([JwtBearerScope.ProjectsDelete], req.user.scopes);

    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id');
    }

    await this.projectsService.deleteOneById(new Types.ObjectId(id));
  }
}
