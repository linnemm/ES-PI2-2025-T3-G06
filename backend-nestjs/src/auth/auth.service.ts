import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private mailService: MailService,
  ) {}

  // Cadastro
  async createUser(data: any) {
    const user = this.usersRepo.create({
      ...data,
      senha: await bcrypt.hash(data.senha, 10),
    });
    return this.usersRepo.save(user);
  }

  // Login
  async login(data: any) {
    const user = await this.usersRepo.findOne({ where: { email: data.email } });
    if (!user || !(await bcrypt.compare(data.senha, user.senha))) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }
    return { message: 'Login efetuado com sucesso!', user };
  }

  // Esqueceu senha
  async forgotPassword(email: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const resetToken = uuidv4();
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);

    user.resetToken = resetToken;
    user.resetTokenExpires = expiration;
    await this.usersRepo.save(user);

    const resetLink = `http://localhost:5500/frontend/html/RedefinirSenha.html?token=${resetToken}`;

    await this.mailService.sendMail({
      to: user.email,
      subject: 'Redefinição de senha - NotaDez 💚',
      html: `
        <h2>Olá!</h2>
        <p>Você solicitou redefinir sua senha.</p>
        <p><a href="${resetLink}">Clique aqui para redefinir</a></p>
        <p>Este link expira em 1 hora.</p>
      `,
    });

    return { message: 'E-mail de recuperação enviado com sucesso!' };
  }

  // Redefinir senha
  async resetPassword(token: string, novaSenha: string) {
    const user = await this.usersRepo.findOne({ where: { resetToken: token } });

    if (!user || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }

    user.senha = await bcrypt.hash(novaSenha, 10);
    user.resetToken = null;
    user.resetTokenExpires = null;
    await this.usersRepo.save(user);

    return { message: 'Senha redefinida com sucesso!' };
  }
}
