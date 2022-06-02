import { Controller, Body, Post, Get, Param, Put, Delete } from '@nestjs/common';
import { PassengerDTO } from './dto/passenger.dto';
import { PassengerService } from './passenger.service';

@Controller('api/v1/passenger')
export class PassengerController {
    constructor(private readonly _passengerService: PassengerService){}

    @Get()
    index()
    {
        return this._passengerService.getAll();
    }

    @Get(':id')
    show(@Param('id') id:string )
    {
        return this._passengerService.getPassenger(id);
    }

    @Post()
    store(@Body() passengerDTO: PassengerDTO)
    {
        return this._passengerService.store(passengerDTO);
    }

    @Put(':id')
    update(@Param('id') id:string, @Body() passengerDTO: PassengerDTO)
    {
        return this._passengerService.update(id, passengerDTO);
    }

    @Delete(':id')
    destroy(@Param('id') id:string)
    {
        return this._passengerService.delete(id);
    }
}
