import { Body, Controller, Post } from '@nestjs/common';
import { UserModel } from '../../generated/prisma/models';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('signup')
  async signupUser(
    @Body() userData: CreateUserDto,
  ): Promise<UserModel> {
    return this.usersService.createUser(userData);
  }
}
