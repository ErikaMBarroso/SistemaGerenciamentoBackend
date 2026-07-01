import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JsonWebTokenError, TokenExpiredError } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){

    handleRequest(err: any, user: any, info: any){
        if(info instanceof TokenExpiredError){
            throw new UnauthorizedException('Token expirado');
        }
        if (info instanceof JsonWebTokenError){
            throw new UnauthorizedException('Token inválido');

        }

        if (err || !user){
            throw new UnauthorizedException('Não autorizado');
        }
        return user;
    }
        
    }
