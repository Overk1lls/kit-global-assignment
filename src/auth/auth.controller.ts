import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthResponseDto, SignInDto, SignUpDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() dto: SignInDto): Promise<AuthResponseDto> {
    return await this.authService.signIn(dto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async signUp(@Body() dto: SignUpDto): Promise<AuthResponseDto> {
    return await this.authService.signUp(dto);
  }
}
