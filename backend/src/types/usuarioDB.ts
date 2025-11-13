export interface UsuarioDB {
  ID: number;
  NOME: string;
  EMAIL: string;
  TELEFONE: string | null;
  SENHA: string;
  CRIADO_EM?: Date;

  // 🔥 ADICIONADO PARA O LOGIN FUNCIONAR
  PRIMEIRO_ACESSO: number;
}
