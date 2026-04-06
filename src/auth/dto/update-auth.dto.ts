import { PartialType } from '@nestjs/mapped-types';
import { RegisterUserDto } from './auth-register.dto';

export class UpdateUserDto extends PartialType(RegisterUserDto) {}
