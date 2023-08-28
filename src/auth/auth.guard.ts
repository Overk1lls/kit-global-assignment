import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtHelperService } from '../jwt-helper/jwt-helper.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtHelperService: JwtHelperService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    request.user = await this.jwtHelperService.getAccessTokenPayload(request);

    return true;
  }
}
