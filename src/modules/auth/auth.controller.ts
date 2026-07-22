import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "../user/dto/dto.login";
import { ApiOperation } from "@nestjs/swagger";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";

@Controller('auth')
export class AuthController{
    constructor(private readonly authService: AuthService){}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(ThrottlerGuard)
    @Throttle({default: {ttl: 60_000, limit:  5,},})
    @ApiOperation({ summary:'Login do administrador ou financeiro' })   
    login(@Body() body: LoginDto){
        return this.authService.login(body.email, body.senha);
    }
}