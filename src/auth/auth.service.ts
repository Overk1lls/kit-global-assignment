import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtHelperService } from '../jwt-helper/jwt-helper.service';
import { SignInDto, SignUpDto } from '../dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtHelperService: JwtHelperService) {}

  async signUp(dto: SignUpDto) {
    try {
      const newUser = await this.usersService.create(dto);

      return await this.jwtHelperService.generateUserTokens(newUser._id);
    } catch (error) {
      if (error.message.indexOf('E11000') !== -1) {
        throw new BadRequestException('User with such credentials already exists!');
      }
      throw error;
    }
  }

  async signIn(dto: SignInDto) {
    const user = await this.validateUser(dto);

    return await this.jwtHelperService.generateUserTokens(user._id);
  }

  private async validateUser(dto: SignInDto) {
    const user = await this.usersService.findOne({ username: dto.username }, { password: true });

    if (user && (await bcrypt.compare(dto.password, user.password))) {
      return user;
    }

    throw new BadRequestException('Credentials are incorrect!');
  }
}
