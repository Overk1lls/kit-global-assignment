import { v4 as uuid } from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtHelperService } from './jwt-helper.service';
import { jwtAlgorithm, jwtAudience, jwtAccessTokenTTL, jwtIssuer, fullAccessScopes } from './jwt-helper.constants';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { mockJwtTokens } from '../../test/mocks';
import { JwtPayload } from './interfaces';

describe('JwtService', () => {
  let jwtHelperService: JwtHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET_ACCESS,
          signOptions: {
            algorithm: jwtAlgorithm,
            audience: jwtAudience,
            expiresIn: jwtAccessTokenTTL,
            issuer: jwtIssuer,
            jwtid: uuid(),
          },
        }),
      ],
      providers: [JwtHelperService],
    }).compile();

    jwtHelperService = module.get<JwtHelperService>(JwtHelperService);
  });

  describe('assertRequiredScopes()', () => {
    it('should be ok', () => {
      jwtHelperService.assertRequiredScopes([], fullAccessScopes);

      expect(1 + 1).toBe(2);
    });

    it('should throw an error', () => {
      const invokeFn = () => jwtHelperService.assertRequiredScopes(fullAccessScopes, []);

      expect(invokeFn).toThrowError(ForbiddenException);
    });
  });

  describe('getAccessTokenPayload()', () => {
    it('should return JwtPayload', async () => {
      const tokens = await jwtHelperService.generateUserTokens('123');
      const req = {
        headers: {
          authorization: `Bearer ${tokens.accessToken}`,
        },
      } as Request;

      const jwt = await jwtHelperService.getAccessTokenPayload(req);

      expect(jwt).toEqual(
        expect.objectContaining<Partial<JwtPayload>>({
          sub: '123',
          aud: jwtAudience,
          iss: jwtIssuer,
          scopes: fullAccessScopes,
        }),
      );
    });

    it('should throw an error (token expired)', async () => {
      const req = {
        headers: {
          authorization: `Bearer ${mockJwtTokens.accessToken}`,
        },
      } as Request;

      const invokeFn = async () => await jwtHelperService.getAccessTokenPayload(req);

      expect(invokeFn).rejects.toThrowError(UnauthorizedException);
    });

    it('should throw an error (not bearer token)', async () => {
      const req = {
        headers: {
          authorization: `${mockJwtTokens.accessToken}`,
        },
      } as Request;

      const invokeFn = async () => await jwtHelperService.getAccessTokenPayload(req);

      expect(invokeFn).rejects.toThrowError(UnauthorizedException);
    });
  });
});
