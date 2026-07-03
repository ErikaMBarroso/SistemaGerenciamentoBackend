import { SetMetadata } from "@nestjs/common";

export const Perfis = (...perfis: string[]) => SetMetadata('perfil', perfis);