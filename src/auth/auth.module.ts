import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { jwtAccessTokenTTL, jwtAlgorithm, jwtAudience, jwtIssuer } from './auth.constants';
import { v4 as uuid } from 'uuid';

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
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
