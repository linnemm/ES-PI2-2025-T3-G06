import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ unique: true })
  email: string;

  @Column()
  telefone: string;

  @Column()
  senha: string;

  @Column({ nullable: true })
resetToken?: string | null;

  @Column({ nullable: true })
resetTokenExpires?: Date | null;
}
