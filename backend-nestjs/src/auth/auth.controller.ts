import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Rota para cadastrar usuário
  @Post('register')
  async register(@Body() userData: Partial<User>) {
    return this.authService.register(userData);
  }

  // Rota para listar usuários (só para testar)
  @Get('users')
  async getAll() {
    return this.authService.getAll();
  }
}
