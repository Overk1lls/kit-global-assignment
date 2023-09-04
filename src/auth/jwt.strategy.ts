import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { fullAccessScopes, jwtAlgorithm, jwtAudience, jwtIssuer } from '../jwt-helper/jwt-helper.constants';
import { JwtPayload } from '../jwt-helper/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET_ACCESS'),
      issuer: jwtIssuer,
      audience: jwtAudience,
      algorithms: [jwtAlgorithm],
    });
  }

  validate(payload: JwtPayload) {
    if (!fullAccessScopes.every((v) => payload.scopes.includes(v))) {
      throw new ForbiddenException('You are not permitted to perform this action.');
    }

    return {
      userId: payload.sub,
      jti: payload.jti,
      scopes: payload.scopes,
    };
  }
}
