import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { JwtHelperModule } from '../jwt-helper/jwt-helper.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule, JwtHelperModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
