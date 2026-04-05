import { Body, Controller } from '@nestjs/common';
import { UserModel } from '../../generated/prisma/models';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  async signupUser(
    @Body() userData: { name?: string; email: string },
  ): Promise<UserModel> {
    return this.usersService.createUser(userData);
  }
}
