import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtHelperService } from '../jwt-helper/jwt-helper.service';
import { exerciseScopes } from '../jwt-helper/jwt-helper.constants';

@Injectable()
export class ExercisesMiddleware implements NestMiddleware {
  constructor(private readonly jwtHelperService: JwtHelperService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const payload = await this.jwtHelperService.getAccessTokenPayload(req);
    this.jwtHelperService.assertRequiredScopes(exerciseScopes, payload.scopes);

    next();
  }
}
