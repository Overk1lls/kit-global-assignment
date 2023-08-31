import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { ProjectsService } from './projects.service';
import { JwtHelperService } from '../jwt-helper/jwt-helper.service';
import { JwtBearerScope } from '../jwt-helper/jwt-helper.enum';
import { AuthGuard } from '../auth/auth.guard';
import { JwtPayload } from '../interfaces';
import { ProjectCreateDto } from '../dto/project-create.dto';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly jwtHelperServicee: JwtHelperService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @UseGuards(AuthGuard)
  async createOne(@Req() req: Request & { user: JwtPayload }, @Body() dto: ProjectCreateDto) {
    this.jwtHelperServicee.assertRequiredScopes([JwtBearerScope.ProjectsCreate], req.user.scopes);

    return await this.projectsService.create(dto);
  }
}
