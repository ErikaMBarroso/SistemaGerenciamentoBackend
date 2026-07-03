export interface JwtPayload{
    sub: number;
    nome: string;
    perfil: string;
    iat?: number;
    exp?: number;
}