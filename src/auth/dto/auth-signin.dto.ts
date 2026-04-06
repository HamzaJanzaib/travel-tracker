import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class loginUserDto {
    @ApiProperty({
        example: 'hamza@example.com',
        description: 'Registered email address',
    })
    @IsEmail()
    email!: string;

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
