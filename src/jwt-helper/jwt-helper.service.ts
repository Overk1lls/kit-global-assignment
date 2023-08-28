import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Types } from 'mongoose';
import { JwtBearerScope } from './jwt-helper.enum';
import { fullAccessScopes, jwtAudience, jwtIssuer, jwtRefreshTokenTTL } from './jwt-helper.constants';
import { JwtPayload } from '../interfaces';

@Injectable()
export class JwtHelperService {
  constructor(private readonly configService: ConfigService, private readonly jwtService: JwtService) {}

  assertRequiredScopes(requiredScopes: ReadonlyArray<JwtBearerScope>, actualScopes: ReadonlyArray<JwtBearerScope>) {
    if (requiredScopes.some((s) => !actualScopes.includes(s))) {
      throw new ForbiddenException('You are not permitted to perform this action!');
    }
  }

  async getAccessTokenPayload(req: Request): Promise<JwtPayload> {
    const token = this.extractTokenFromHeader(req);

    try {
      const jwtSecretAccess = this.configService.getOrThrow<string>('JWT_SECRET_ACCESS');

      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: jwtSecretAccess,
        audience: jwtAudience,
        issuer: jwtIssuer,
      });
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async generateUserTokens(userId: string | Types.ObjectId) {
    return {
      accessToken: await this.generateAccessToken(userId),
      refreshToken: await this.generateRefreshToken(userId),
    };
  }

  private async generateAccessToken(userId: string | Types.ObjectId) {
    const payload = {
      sub: userId,
      scopes: fullAccessScopes,
    };

    return await this.jwtService.signAsync(payload);
  }

  private async generateRefreshToken(userId: string | Types.ObjectId) {
    const jwtSecretRefresh = this.configService.getOrThrow<string>('JWT_SECRET_REFRESH');

    return this.jwtService.signAsync(
      { sub: userId, scopes: [JwtBearerScope.TokenRefresh] },
      {
        secret: jwtSecretRefresh,
        expiresIn: jwtRefreshTokenTTL,
      },
    );
  }

  private extractTokenFromHeader(req: Request): string {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer') {
      throw new UnauthorizedException();
    }

    return token;
  }
}
