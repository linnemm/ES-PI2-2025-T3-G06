// Autora: Alinne

// representa o formato do usuário retornado do banco de dados.
export interface UsuarioDB {
  ID: number;
  NOME: string;
  EMAIL: string;
  TELEFONE: string | null;
  SENHA: string;
  CRIADO_EM?: Date;
// indica se é o primeiro acesso (1 = sim, 0 = não)
  PRIMEIRO_ACESSO: number;
}
