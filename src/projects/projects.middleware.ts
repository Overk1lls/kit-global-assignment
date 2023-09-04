import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtHelperService } from '../jwt-helper/jwt-helper.service';
import { projectScopes } from '../jwt-helper/jwt-helper.constants';

@Injectable()
export class ProjectsMiddleware implements NestMiddleware {
  constructor(private readonly jwtHelperService: JwtHelperService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const payload = await this.jwtHelperService.getAccessTokenPayload(req);
    this.jwtHelperService.assertRequiredScopes(projectScopes, payload.scopes);

    next();
  }
}
