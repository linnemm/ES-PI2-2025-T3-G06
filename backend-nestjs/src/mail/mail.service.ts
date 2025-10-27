import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // ou outro serviço de e-mail
      auth: {
        user: 'seuemail@gmail.com',
        pass: 'suasenhaouapppassword',
      },
    });
  }

  async sendMail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: '"NotaDez" <seuemail@gmail.com>',
      to,
      subject,
      html,
    });
  }
}
