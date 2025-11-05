import oracledb from "oracledb";
import { dbConfig } from "../config/database";
import { UsuarioDB } from "../types/usuarioDB";

// busca um ou mais usuários no banco pelo e-mail informado
export async function findUserByEmail(email: string): Promise<UsuarioDB[]> {
  const connection = await oracledb.getConnection(dbConfig);
  //executa comando sql de consulta
  const result = await connection.execute(
    `SELECT id, nome, email, telefone, senha, criado_em FROM usuarios WHERE email = :email`,
    [email], 
    { outFormat: oracledb.OUT_FORMAT_OBJECT } // define o formato do retorno (objeto JS)
  );
  await connection.close();

  // retorna os resultados da consulta já convertidos para o tipo UsuarioDB (objeto js e propriedades do usuario)
  return result.rows as UsuarioDB[];
}

// cria novo usuário
export async function createUser(nome: string, email: string, telefone: string, senha: string) {
  const connection = await oracledb.getConnection(dbConfig);
  await connection.execute(
    `INSERT INTO usuarios (nome, email, telefone, senha) VALUES (:nome, :email, :telefone, :senha)`,
    [nome, email, telefone, senha],
    { autoCommit: true } // salva no banco automaticamente
  );
  await connection.close();
}
