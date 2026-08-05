import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Column } from 'typeorm';

export class LoginDto {
  @ApiProperty({ example: 'user@dominio.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: '12345' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  @Column({ select: false })
  senha!: string;
}
