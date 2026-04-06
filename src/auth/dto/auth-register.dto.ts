import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    example: 'hamza@example.com',
    description: 'Unique email for the user account',
  })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({
    example: 'Hamza',
    description: 'Display name for the user profile',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    example: 'StrongPass123!',
    minLength: 8,
    maxLength: 128,
    description: 'Account password',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}
