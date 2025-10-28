import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
  await this.transporter.sendMail({
    from: `"NotaDez 💚" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
}

}