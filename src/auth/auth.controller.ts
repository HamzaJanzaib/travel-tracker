import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/auth-register.dto';
import { loginUserDto } from './dto/auth-signin.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  async signup(@Body() registerDto: RegisterUserDto) {
    return this.authService.signup(registerDto);
  }

  @Post('signin')
  async signin(@Body() loginDto: loginUserDto) {
    return this.authService.signin(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  

}
