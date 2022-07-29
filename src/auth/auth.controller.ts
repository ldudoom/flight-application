import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserDTO } from './user/dto/user.dto';

@ApiTags('Authentication')
@Controller('api/v1/auth')
export class AuthController {

    constructor(private readonly _authService: AuthService){}

    @UseGuards(LocalAuthGuard)
    @Post('signin')
    async signIn(@Req() req)
    {
        return await this._authService.signIn(req.user);
    }

    @Post('signup')
    async signUp(@Body() userDTO: UserDTO)
    {
        return await this._authService.signUp(userDTO);
    }
}

