
import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, User } from '../../generated/prisma/client';
import { PrismaService } from '../prisma.service';
import { RegisterUserDto } from './dto/auth-register.dto';
import * as bcrypt from 'bcrypt';
import { loginUserDto } from './dto/auth-signin.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService,
    private jwtService: JwtService
  ) { }

  async signup(registerUserDto: RegisterUserDto) {
    const { email, name, password } = registerUserDto;

    /**
     * Check if a user with the provided email already exists. If so, throw a ConflictException to indicate that the email is already in use.
     * If the email is unique, hash the password using bcrypt and create a new user record in the database with the provided email, name, and hashed password. Finally, return the newly created user.
     */
    const CheckUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (CheckUser) {
      throw new ConflictException('User with this email already exists');
    }

    /**
     * Hash the password using bcrypt with a salt rounds of 10. This ensures that the password is securely stored in the database, making it more resistant to brute-force attacks and unauthorized access.
     */
    const hashedPassword = await bcrypt.hash(password, 10);

    /**
     * Create a new user record in the database using Prisma's create method. The data object includes the email, name, and hashed password. After the user is created, the password field is excluded from the returned result for security reasons, and the remaining user information is returned to the caller.
     */
    const newUser = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const { password: _, ...result } = newUser;

    /**
     * The password field is excluded from the returned result to enhance security by preventing the hashed password from being exposed in API responses or logs. This practice helps protect user credentials and reduces the risk of unauthorized access to sensitive information.
     */
    return result;
  }


  async signin(loginDto: loginUserDto) {
    const { email, password } = loginDto;

    /**
     * Check if a user with the provided email exists in the database. If no user is found, throw a ConflictException indicating that the email or password is invalid. If a user is found, compare the provided password with the stored hashed password using bcrypt's compare function. If the passwords do not match, throw a ConflictException indicating that the email or password is invalid. If the passwords match, exclude the password field from the returned user object and return the remaining user information to the caller.
     */
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new ConflictException('Invalid email or password!');
    }

    /**
     * Use bcrypt's compare function to compare the provided password with the stored hashed password. This function returns a boolean indicating whether the passwords match. If the passwords do not match, a ConflictException is thrown to indicate that the email or password is invalid. If the passwords match, the user object is returned with the password field excluded for security reasons.
     */
    const MatchPassword = await bcrypt.compare(password , user.password)

    if (!MatchPassword) {
      throw new ConflictException('Invalid email or password!');
    }

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);


    const { password: _, ...result } = user;

    return {
      message: 'Login successful',
      token,
      user: result,
    };

  }
}
