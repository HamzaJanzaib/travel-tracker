import { Body, Controller, Post } from '@nestjs/common';
import { UserModel } from '../../generated/prisma/models';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-auth.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  async signupUser(
    @Body() userData: CreateUserDto,
  ): Promise<UserModel> {
    return this.authService.createUser(userData);
  }
}
