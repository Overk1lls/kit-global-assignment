import { Body, ConflictException, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiConflictResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthResponseDto, SignInDto, SignUpDto } from './dto';
import { ApiErrorDescription } from '../common/enum';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() dto: SignInDto): Promise<AuthResponseDto> {
    return await this.authService.signIn(dto);
  }

  @ApiConflictResponse({ description: ApiErrorDescription.USER_ALREADY_EXISTS })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async signUp(@Body() dto: SignUpDto): Promise<AuthResponseDto> {
    try {
      return await this.authService.signUp(dto);
    } catch (error) {
      if (error.message.indexOf('E11000') !== -1) {
        throw new ConflictException(ApiErrorDescription.USER_ALREADY_EXISTS);
      }
      throw error;
    }
  }
}
