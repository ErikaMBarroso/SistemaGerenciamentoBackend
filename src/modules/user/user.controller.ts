import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { Validate } from 'class-validator';
import { LoginDto } from './dto/dto.login';
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ){}

    @Post('login')
    @UsePipes(new ValidationPipe())
    login(@Body() body: LoginDto){
        return this.userService.login(body.email, body.senha)
    }
}
