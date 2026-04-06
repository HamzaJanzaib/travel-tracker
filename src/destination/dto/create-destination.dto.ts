import { IsString, IsNotEmpty, IsOptional, IsDateString, IsInt } from 'class-validator';

export class CreateDestinationDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsDateString()
    travelDate!: string;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsString()
    @IsOptional()
    location?: string;
}