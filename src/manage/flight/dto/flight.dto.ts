import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsDateString } from "class-validator";

export class FlightDTO{

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly pilot: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly airplane: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly destinationCity: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    readonly flightDate: Date;
}