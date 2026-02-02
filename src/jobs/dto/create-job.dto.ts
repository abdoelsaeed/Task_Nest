/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
    IsString,
    IsNotEmpty,
    IsInt,
    Min,
    IsOptional,
    IsObject,
} from 'class-validator';
export class CreateJobDto {
    @IsString({ message:'name must be a string'})
    @IsNotEmpty()
    name: string;

    // Interval in seconds (e.g. every 60 seconds)
    @IsInt({ message:'intervalInSeconds must be a string'})
    @Min(1)
    intervalInSeconds: number;

    // Custom job data (email, numbers, etc.)
    @IsOptional()
    @IsObject()
    payload?: Record<string, any>;
}
