import { Controller, Body, Post, Get, Param, Put, Delete } from '@nestjs/common';
import { FlightDTO } from './dto/flight.dto';
import { FlightService } from './flight.service';

@Controller('api/v1/flight')
export class FlightController {
    constructor(private readonly _flightService: FlightService){}

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
}
