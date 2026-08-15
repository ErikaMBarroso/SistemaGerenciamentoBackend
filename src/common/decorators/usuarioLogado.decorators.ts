import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const UsuarioLogado = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) =>{
        const request = ctx.switchToHttp().getRequest();
        return request.user
    }
)