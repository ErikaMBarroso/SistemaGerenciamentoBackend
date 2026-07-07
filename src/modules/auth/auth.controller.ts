import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "../user/dto/dto.login";
import { ApiOperation } from "@nestjs/swagger";

@Controller('auth')
export class AuthController{
    constructor(private readonly authService: AuthService){}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary:'Login do administrador ou financeiro' })   
    login(@Body() body: LoginDto){
        return this.authService.login(body.email, body.senha);
    }
}