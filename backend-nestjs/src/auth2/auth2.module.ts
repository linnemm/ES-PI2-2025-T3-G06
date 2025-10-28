// Autoria: Miriã

// auth2.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth2.service.js';
import { AuthController } from './auth2.controller';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}