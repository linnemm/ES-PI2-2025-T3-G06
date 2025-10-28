// Autoria: Miriã

export class User {
  id: number;
  email: string;
  password: string;
  resetToken?: string;
  resetTokenExpires?: Date;
}