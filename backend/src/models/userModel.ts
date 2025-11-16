import { openConnection } from "../config/database";

// Tipo opcional para padronizar
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

// Transformar row → UsuarioDB
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

// =============================================
// BUSCAR USUÁRIO POR EMAIL (para login)
// =============================================
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

    if (rows.length === 0) return null;

    return mapUsuario(rows[0]);
  } finally {
    await conn.close();
  }
}

// =============================================
// BUSCAR USUÁRIO POR ID (para /me, update)
// =============================================
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

// =============================================
// CRIAR NOVO USUÁRIO
// =============================================
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

// =============================================
// ATUALIZAR EMAIL
// =============================================
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

// =============================================
// ATUALIZAR SENHA (hash)
// =============================================
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
