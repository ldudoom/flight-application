import { HttpStatus, Injectable } from '@nestjs/common';
import { IFlight } from 'src/commons/interfaces/manage/flight.interface';
import { FlightDTO } from './dto/flight.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FLIGHT } from 'src/commons/models/models';
import { Model } from 'mongoose';

@Injectable()
export class FlightService {
    constructor(@InjectModel(FLIGHT.name) private readonly _model: Model<IFlight>){}

    async getAll(): Promise<IFlight[]>
    {
        return await this._model.find().populate('passengers');
    }

    async getFlight(id: string): Promise<IFlight>
    {
        return await this._model.findById(id).populate('passengers');
    }

    async store(flightDTO: FlightDTO): Promise<IFlight>
    {
        return await new this._model(flightDTO).save();
    }

    async update(id: string, flightDTO: FlightDTO): Promise<IFlight>
    {
        return await this._model.findByIdAndUpdate(id, flightDTO, {new: true}).populate('passengers');
    }

    async delete(id: string): Promise<Object>
    {
        await this._model.findByIdAndDelete(id);
        return {
            status: HttpStatus.OK,
            message: 'Flight deleted'
        };
    }

    async addPassenger(flightId: string, passengerId: string): Promise<IFlight>
    {
        return await this._model.findByIdAndUpdate(
                flightId, 
                { 
                    $addToSet: { passengers:passengerId } 
                }, 
                { new: true }
        ).populate('passengers');
    }
}
