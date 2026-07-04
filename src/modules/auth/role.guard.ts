import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { request } from "http";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean {

        const perfisPermitidos = this.reflector.getAllAndOverride<string[]>('perfil', [context.getHandler(),context.getClass()]);
        
        if(!perfisPermitidos) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!perfisPermitidos.includes(user.perfil)){
            throw new ForbiddenException('Acesso negado')
        }
        return true;
    }
    
}
