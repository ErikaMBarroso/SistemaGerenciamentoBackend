import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "../user/dto/dto.login";

@Controller('auth')
export class AuthController{
    constructor(private readonly authService: AuthService){}

    @Post('login')
    @UsePipes(new ValidationPipe())
    login(@Body() body: LoginDto){
        return this.authService.login(body.email, body.senha);
    }
}