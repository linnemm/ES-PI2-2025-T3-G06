import oracledb from "oracledb";
import { dbConfig } from "../config/database";
import { UsuarioDB } from "../types/usuarioDB";

// ======================= BUSCAR USUÁRIO POR EMAIL =======================
export async function findUserByEmail(email: string): Promise<UsuarioDB[]> {
  const connection = await oracledb.getConnection(dbConfig);

  const result = await connection.execute(
    `SELECT 
        id, 
        nome, 
        email, 
        telefone, 
        senha, 
        criado_em,
        primeiro_acesso
     FROM usuarios 
     WHERE email = :email`,
    [email],
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  await connection.close();

  // Garantimos que o retorno é do tipo UsuarioDB[]
  return result.rows as UsuarioDB[];
}

// ======================= CRIAR NOVO USUÁRIO =======================
export async function createUser(
  nome: string,
  email: string,
  telefone: string,
  senha: string
) {
  const connection = await oracledb.getConnection(dbConfig);

  await connection.execute(
    `INSERT INTO usuarios 
        (nome, email, telefone, senha, primeiro_acesso) 
     VALUES 
        (:nome, :email, :telefone, :senha, 1)`,
    [nome, email, telefone, senha],
    { autoCommit: true }
  );

  await connection.close();
}
