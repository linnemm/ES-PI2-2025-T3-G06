import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto.js';

import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private users: any[] = [
    { id: 1, email: 'teste@email.com', password: '$2b$10$...' },
  ];

  constructor(private readonly mailService: MailService) {}

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = this.users.find(u => u.email === dto.email);
    if (!user) throw new NotFoundException('Usuário não encontrado');

    // Gera token aleatório
    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1h

    // Envia o link por e-mail
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    await this.mailService.sendMail({
      to: user.email,
      subject: 'Redefinição de senha',
      html: `<p>Clique no link para redefinir sua senha:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });

    return { message: 'E-mail enviado para redefinir senha' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = this.users.find(u => u.resetToken === dto.token);
    if (!user) throw new BadRequestException('Token inválido');
    if (user.resetTokenExpires < new Date()) throw new BadRequestException('Token expirado');

    user.password = await bcrypt.hash(dto.newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpires = null;

    return { message: 'Senha redefinida com sucesso!' };
  }
}

