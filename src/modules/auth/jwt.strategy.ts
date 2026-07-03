import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "./interface/jwtPayload.interface";



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private configService: ConfigService){
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: configService.get<string>('JWT_SECRET')!,
      });
    }

    async validate(payload: JwtPayload){
    if (!payload.sub){
        throw new UnauthorizedException('Token inválido');
    }
    return {
        usuarioId: payload.sub,
        nome: payload.nome,
        perfil: payload.perfil,
    };
}
}