import { IsNotEmpty, IsString, IsDateString } from "class-validator";

export class FlightDTO{
    @IsNotEmpty()
    @IsString()
    readonly pilot: string;

    @IsNotEmpty()
    @IsString()
    readonly airplane: string;

    @IsNotEmpty()
    @IsString()
    readonly destinationCity: string;

    @IsNotEmpty()
    @IsDateString()
    readonly flightDate: Date;
}