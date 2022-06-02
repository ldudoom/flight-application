import { IsNotEmpty, IsString, IsDate } from "class-validator";

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
    @IsDate()
    readonly flightDate: Date;
}