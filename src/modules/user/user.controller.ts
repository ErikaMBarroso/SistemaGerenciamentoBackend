import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/auth.guard';
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ){}

    @Get('teste')
    async teste(){
        return 'oi'
    }

}
