import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/create-auth.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  async register(@Body() registerDto: RegisterUserDto) {
    return this.authService.register(registerDto);
  }

}
