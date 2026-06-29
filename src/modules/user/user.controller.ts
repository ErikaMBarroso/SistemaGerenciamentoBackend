import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ){}

    @Post('login')
    login(@Body() body: any){
        return this.userService.login(
            body.email,
            body.senha,
        );
    }
}
