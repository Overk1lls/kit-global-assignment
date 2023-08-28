import { v4 as uuid } from 'uuid';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtHelperService } from './jwt-helper.service';
import { jwtAlgorithm, jwtAudience, jwtAccessTokenTTL, jwtIssuer } from './jwt-helper.constants';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.getOrThrow<string>('JWT_SECRET_ACCESS');
        const jid = uuid();

        return {
          global: true,
          secret: jwtSecret,
          signOptions: {
            algorithm: jwtAlgorithm,
            audience: jwtAudience,
            expiresIn: jwtAccessTokenTTL,
            issuer: jwtIssuer,
            jwtid: jid,
          },
        };
      },
    }),
  ],
  providers: [JwtHelperService, JwtService],
})
export class JwtHelperModule {}
