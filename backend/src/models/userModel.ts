// Autora: Alinne

import { openConnection } from "../config/database";


// interface que representa a estrutura de um usuário no banco
export interface UsuarioDB {
  ID: number;
  NOME: string;
  EMAIL: string;
  TELEFONE?: string;
  SENHA: string;
  CRIADO_EM: Date;
  TEM_INSTITUICAO: number;
  TEM_CURSOS: number;
  PRIMEIRO_ACESSO: number;
}

// converte uma linha do banco para o formato UsuarioDB
function mapUsuario(row: any): UsuarioDB {
  return {
    ID: row.ID,
    NOME: row.NOME,
    EMAIL: row.EMAIL,
    TELEFONE: row.TELEFONE,
    SENHA: row.SENHA,
    CRIADO_EM: row.CRIADO_EM,
    TEM_INSTITUICAO: row.TEM_INSTITUICAO,
    TEM_CURSOS: row.TEM_CURSOS,
    PRIMEIRO_ACESSO: row.PRIMEIRO_ACESSO
  };
}

// Busca usuário pelo e-mail
export async function findUserByEmail(email: string): Promise<UsuarioDB | null> {
  const conn = await openConnection();

  try {
    const sql = `
      SELECT 
        ID, NOME, EMAIL, TELEFONE, SENHA, CRIADO_EM,
        TEM_INSTITUICAO, TEM_CURSOS, PRIMEIRO_ACESSO
      FROM USUARIOS
      WHERE EMAIL = :email
    `;

    const result = await conn.execute(sql, { email });
    const rows = result.rows || [];

    // se nenhum usuário for encontrado, retorna null
    if (rows.length === 0) return null;

    // retorna o usuário já mapeado para o formato da aplicação
    return mapUsuario(rows[0]);
  } finally {
    await conn.close();
  }
}

// busca usuário pelo ID
export async function findUserById(id: number): Promise<UsuarioDB | null> {
  const conn = await openConnection();

  try {
    const sql = `
      SELECT 
        ID, NOME, EMAIL, TELEFONE, SENHA, CRIADO_EM,
        TEM_INSTITUICAO, TEM_CURSOS, PRIMEIRO_ACESSO
      FROM USUARIOS
      WHERE ID = :id
    `;

    const result = await conn.execute(sql, { id });
    const rows = result.rows || [];

    if (rows.length === 0) return null;

    return mapUsuario(rows[0]);
  } finally {
    await conn.close();
  }
}

// Cria novo usuário
export async function createUser(
  nome: string,
  email: string,
  telefone: string,
  senhaHash: string
) {
  const conn = await openConnection();

  try {
    await conn.execute(
      `
        INSERT INTO USUARIOS
          (NOME, EMAIL, TELEFONE, SENHA, PRIMEIRO_ACESSO)
        VALUES
          (:nome, :email, :telefone, :senha, 1)
      `,
      { nome, email, telefone, senha: senhaHash }
    );

    await conn.commit();
  } finally {
    await conn.close();
  }
}

// Atualiza o e-mail do usuário
export async function updateUserEmail(id: number, novoEmail: string) {
  const conn = await openConnection();

  try {
    await conn.execute(
      `UPDATE USUARIOS SET EMAIL = :email WHERE ID = :id`,
      { email: novoEmail, id }
    );

    await conn.commit();
  } finally {
    await conn.close();
  }
}

// Atualiza a senha do usuário
export async function updateUserPassword(id: number, senhaHash: string) {
  const conn = await openConnection();

  try {
    await conn.execute(
      `UPDATE USUARIOS SET SENHA = :senha WHERE ID = :id`,
      { senha: senhaHash, id }
    );

    await conn.commit();
  } finally {
    await conn.close();
  }
}
