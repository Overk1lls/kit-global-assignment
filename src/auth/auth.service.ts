import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { JwtBearerScope } from './auth.enum';
import { fullAccessScopes, jwtRefreshTokenTTL } from './auth.constants';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: SignUpDto) {
    try {
      const saveResult = await this.usersService.create(dto);
      const payload = {
        sub: saveResult.id,
        username: saveResult.username,
        scopes: fullAccessScopes,
      };

      return {
        accessToken: await this.jwtService.signAsync(payload),
        refreshToken: await this.generateRefreshToken(saveResult.id),
      };
    } catch (error) {
      if (error.message.indexOf('E11000') !== -1) {
        throw new BadRequestException(`User with email '${error.keyValue.email}' already exists!`);
      }
      throw error;
    }
  }
  }

  private async generateRefreshToken(userId: number | string): Promise<string> {
    const jwtSecretRefresh = this.configService.getOrThrow<string>('JWT_SECRET_REFRESH');

    return this.jwtService.signAsync(
      { sub: userId, scopes: [JwtBearerScope.TokenRefresh] },
      {
        secret: jwtSecretRefresh,
        expiresIn: jwtRefreshTokenTTL,
      },
    );
  }
}
