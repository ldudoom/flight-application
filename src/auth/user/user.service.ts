import { Injectable, HttpStatus } from '@nestjs/common';
import { IUser } from 'src/commons/interfaces/auth/user.interface';
import { UserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { USER } from 'src/commons/models/models';
import { Model } from 'mongoose';
import { ObjectEncodingOptions } from 'fs';

@Injectable()
export class UserService {

    constructor(@InjectModel(USER.name) private readonly _model: Model<IUser>){}

    async findByUsername(username: string): Promise<IUser>{
        return await this._model.findOne({ username });
    }

    async checkPassword(password: string, passwordDB: string): Promise<boolean>
    {
        return await bcrypt.compare(password, passwordDB);
    }

    async hashPassword(password: string): Promise<string>{
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    async store(userDTO: UserDTO): Promise<IUser>{
        const hash = await this.hashPassword(userDTO.password);
        const newUser = new this._model({...userDTO, password: hash});
        return await newUser.save();
    }

    async getAll(): Promise<IUser[]>{
        return await this._model.find();
    }

    async getUser(id: string): Promise<IUser>{
        return await this._model.findById(id);
    }

    async update(id: string, userDTO: UserDTO): Promise<IUser>{
        const hash = await this.hashPassword(userDTO.password);
        const user = {...userDTO, password: hash}
        return await this._model.findByIdAndUpdate(id, user, {new: true});
    }

    async delete(id: string): Promise<Object>{
        await this._model.findByIdAndDelete(id);
        return {
            status: HttpStatus.OK,
            message: 'User deleted'
        };
    }

}
