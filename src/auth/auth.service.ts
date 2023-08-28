import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { JwtBearerScope } from './auth.enum';
import { fullAccessScopes, jwtRefreshTokenTTL } from './auth.constants';
import { SignInDto, SignUpDto } from '../dto';
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
        sub: saveResult._id,
        username: saveResult.username,
        scopes: fullAccessScopes,
      };

      return {
        accessToken: await this.jwtService.signAsync(payload),
        refreshToken: await this.generateRefreshToken(saveResult._id),
      };
    } catch (error) {
      if (error.message.indexOf('E11000') !== -1) {
        throw new BadRequestException('User with such credentials already exists!');
      }
      throw error;
    }
  }

  async signIn(dto: SignInDto) {
    const user = await this.usersService.findOne({ username: dto.username }, { password: true });
    if (!user) {
      throw new BadRequestException('User not found!');
    }
    if (!(await bcrypt.compare(dto.password, user.password))) {
      throw new BadRequestException('Password is incorrect!');
    }

    const payload = {
      sub: user._id,
      username: user.username,
      scopes: fullAccessScopes,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.generateRefreshToken(user._id),
    };
  }

  private async generateRefreshToken(userId: number | string | Types.ObjectId): Promise<string> {
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
