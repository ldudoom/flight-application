import { Body, Controller, Post, Get, Param, Put, Delete } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('api/v1/user')
export class UserController {

    constructor(private readonly _userService: UserService){}
    
    @Get()
    index(){
        return this._userService.getAll();
    }

    @Post()
    store(@Body() userDTO: UserDTO){
        return this._userService.store(userDTO);
    }

    @Get(':id')
    show(@Param('id') id:string ){
        return this._userService.getUser(id);
    }

    @Put(':id')
    update(@Param('id') id:string, @Body() userDTO: UserDTO){
        return this._userService.update(id, userDTO);
    }

    @Delete(':id')
    destroy(@Param('id') id:string){
        return this._userService.delete(id);
    }
}
