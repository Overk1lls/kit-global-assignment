import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from '../dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() dto: SignInDto) {
    return await this.authService.signIn(dto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async signUp(@Body() dto: SignUpDto) {
    return await this.authService.signUp(dto);
  }
}
