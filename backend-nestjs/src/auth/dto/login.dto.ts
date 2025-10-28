import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail() email: string;
  @IsNotEmpty() senha: string;
}
