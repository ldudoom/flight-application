import { Body, Controller, Post } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('api/v1/user')
export class UserController {

    constructor(private readonly _userService: UserService){}
    
    @Post()
    store(@Body() userDTO: UserDTO){
        return this._userService.store(userDTO);
    }
}
