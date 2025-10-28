// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Cadastrar novo usuário
  async register(userData: Partial<User>) {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  // Buscar todos (pra testar)
  async getAll() {
    return await this.userRepository.find();
  }
}
