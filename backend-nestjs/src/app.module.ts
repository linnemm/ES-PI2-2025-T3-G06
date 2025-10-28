import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './auth/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'oracle',
      host: 'localhost',
      port: 1521,
      username: 'PUC', 
      password: 'puccamp', 
      serviceName: 'XEPDB1',
      synchronize: true, // cria as tabelas automaticamente
      entities: [User],
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
