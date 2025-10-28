import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

TypeOrmModule.forRoot({
  type: 'oracle',
  host: 'localhost',
  port: 1521,
  username: 'system',
  password: 'senha',
  sid: 'XE',
  synchronize: true,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
})

export class AppModule {}
