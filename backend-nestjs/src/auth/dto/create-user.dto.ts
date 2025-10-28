import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty() nome: string;
  @IsEmail() email: string;
  @IsNotEmpty() telefone: string;
  @MinLength(6) senha: string;
}
