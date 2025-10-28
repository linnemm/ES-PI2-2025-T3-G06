import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail() email: string;
  token: string;
  newPassword: string;
}
