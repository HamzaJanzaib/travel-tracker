import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDestinationDto {
    @ApiProperty({
        example: 'Islamabad',
        description: 'Destination name',
    })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({
        example: '2027-10-25',
        description: 'Travel date (ISO 8601 date or datetime)',
    })
    @IsDateString()
    travelDate!: string;

    @ApiPropertyOptional({
        example: 'Business trip',
        description: 'Optional notes for this destination',
    })
    @IsString()
    @IsOptional()
    notes?: string;

    @ApiPropertyOptional({
        example: 'Islamabad, Pakistan',
        description: 'City or location details',
    })
    @IsString()
    @IsOptional()
    location?: string;
}
