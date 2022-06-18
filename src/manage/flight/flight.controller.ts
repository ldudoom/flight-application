import { Controller, Body, Post, Get, Param, Put, Delete, HttpStatus, HttpException } from '@nestjs/common';
import { PassengerService } from '../passenger/passenger.service';
import { FlightDTO } from './dto/flight.dto';
import { FlightService } from './flight.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Flights Resource')
@Controller('api/v1/flight')
export class FlightController {
    constructor(
        private readonly _flightService: FlightService,
        private readonly _passengerService: PassengerService
    ){}

    @Get()
    index()
    {
        return this._flightService.getAll();
    }

    @Get(':id')
    show(@Param('id') id:string )
    {
        return this._flightService.getFlight(id);
    }

    @Post()
    store(@Body() flightDTO: FlightDTO)
    {
        return this._flightService.store(flightDTO);
    }

    @Put(':id')
    update(@Param('id') id:string, @Body() flightDTO: FlightDTO)
    {
        return this._flightService.update(id, flightDTO);
    }

    @Delete(':id')
    destroy(@Param('id') id:string)
    {
        return this._flightService.delete(id);
    }

    @Post(':flightId/passenger/:passengerId')
    async addPassenger(@Param('flightId') flightId: string, @Param('passengerId') passengerId: string)
    {
        const passenger = await this._passengerService.getPassenger(passengerId);
        if( ! passenger){
            throw new HttpException('Passenger not found', HttpStatus.NOT_FOUND);
        }
        return this._flightService.addPassenger(flightId, passengerId);
    }
}
