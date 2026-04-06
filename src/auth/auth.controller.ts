import { Body, Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/auth-register.dto';
import { loginUserDto } from './dto/auth-signin.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterUserDto })
  @ApiOkResponse({ description: 'User registered successfully' })
  async signup(@Body() registerDto: RegisterUserDto) {
    return this.authService.signup(registerDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in and receive JWT token' })
  @ApiBody({ type: loginUserDto })
  @ApiOkResponse({ description: 'Login successful' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async signin(
    @Body() loginDto: loginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.authService.signin(loginDto);

    res.cookie('access_token', response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60_000,
    });

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get the authenticated user profile' })
  @ApiOkResponse({ description: 'Authenticated user profile' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  getProfile(@Request() req) {
    return req.user;
  }
  

}
