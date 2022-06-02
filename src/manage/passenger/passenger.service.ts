import { HttpStatus, Injectable } from '@nestjs/common';
import { IPassenger } from 'src/commons/interfaces/manage/passenger.interface';
import { PassengerDTO } from './dto/passenger.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PASSENGER } from 'src/commons/models/models';
import { Model } from 'mongoose';

@Injectable()
export class PassengerService {
    constructor(@InjectModel(PASSENGER.name) private readonly _model: Model<IPassenger>){}

    async getAll(): Promise<IPassenger[]>
    {
        return await this._model.find();
    }

    async getPassenger(id: string): Promise<IPassenger>
    {
        return await this._model.findById(id);
    }

    async store(passengerDTO: PassengerDTO): Promise<IPassenger>
    {
        const newPassenger = new this._model(passengerDTO);
        return await newPassenger.save();
    }

    async update(id: string, passengerDTO: PassengerDTO): Promise<IPassenger>
    {
        return await this._model.findByIdAndUpdate(id, passengerDTO, {new: true});
    }

    async delete(id: string): Promise<Object>
    {
        await this._model.findByIdAndDelete(id);
        return {
            status: HttpStatus.OK,
            message: 'Passenger deleted'
        };
    }
}
