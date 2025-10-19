import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { NewUserDTO } from 'src/users/dtos/new-user.dto';
import { LoginDto } from './dtos/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PayloadUser } from './types/payload-user.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body(ValidationPipe) body: LoginDto) {
    return this.authService.authenticate(body.email, body.password);
  }

  @Post('register')
  register(@Body(ValidationPipe) body: NewUserDTO) {
    return this.authService.register(body);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() request: Request & { user: PayloadUser }) {
    return this.authService.getUser(request.user);
  }
}
