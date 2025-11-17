// Autora: Alinne

import oracledb from "oracledb";
import { dbConfig } from "../config/database";

// CRIAR CURSO
export async function criarCurso(
  nome: string,
  sigla: string,
  coordenador: string,
  instituicaoId: number,
  usuarioId: number
) {
  // abre conexão com o banco
  const conn = await oracledb.getConnection(dbConfig);

  // executa INSERT
  await conn.execute(
    `
      INSERT INTO cursos (nome, sigla, coordenador, instituicao_id, usuario_id)
      VALUES (:nome, :sigla, :coordenador, :instituicaoId, :usuarioId)
    `,
    // parâmetros da query
    { nome, sigla, coordenador, instituicaoId, usuarioId },
    { autoCommit: true }
  );

  // fecha conexão
  await conn.close();
}

// BUSCAR CURSOS DE UMA INSTITUIÇÃO
export async function buscarCursosPorInstituicao(instituicaoId: number) {
  const conn = await oracledb.getConnection(dbConfig);

  // consulta todos os cursos pertencentes à instituição
  const result = await conn.execute(
    `
      SELECT
        id       AS ID,
        nome     AS NOME,
        sigla    AS SIGLA,
        coordenador AS COORDENADOR,
        criado_em AS CRIADO_EM
      FROM cursos
      WHERE instituicao_id = :id
      ORDER BY nome
    `,
    { id: instituicaoId },
    // retorna objetos ao invés de arrays
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  await conn.close();
  // retorna a lista de cursos
  return result.rows;
}

// BUSCAR CURSO PELO ID
export async function buscarCursoPorId(id: number) {
  const conn = await oracledb.getConnection(dbConfig);

  // executa a consulta SQL para buscar um curso específico pelo ID
  const result = await conn.execute(
    `
      SELECT
        id, nome, sigla, coordenador, instituicao_id, usuario_id
      FROM cursos
      WHERE id = :id
    `,
    { id }, // parâmetro enviado para o banco
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  await conn.close();
  // retorna o primeiro resultado encontrado.
  return result.rows?.[0] || null;
}

// EDITAR CURSO
export async function editarCurso(
  id: number,
  nome: string,
  sigla: string,
  coordenador: string
) {
  const conn = await oracledb.getConnection(dbConfig);

  // atualiza os dados do curso
  await conn.execute(
    `
      UPDATE cursos
      SET nome = :nome,
          sigla = :sigla,
          coordenador = :coordenador
      WHERE id = :id
    `,
    { id, nome, sigla, coordenador },
    { autoCommit: true }
  );

  await conn.close();
}

// VERIFICA SE O CURSO POSSUI DISCIPLINAS
export async function cursoTemDisciplinas(id: number) {
  const conn = await oracledb.getConnection(dbConfig);

  // executa uma consulta SQL para contar quantas disciplinas estão vinculadas ao curso informado
  const result = await conn.execute(
    `
      SELECT COUNT(*) AS TOTAL
      FROM disciplinas
      WHERE curso_id = :id
    `,
    { id },
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  await conn.close();
  // retorna true se houver pelo menos 1 disciplina vinculada
  return (result.rows as any)[0].TOTAL > 0;
}

// EXCLUIR CURSO
export async function excluirCurso(id: number) {
  const conn = await oracledb.getConnection(dbConfig);

  // remove curso da tabela
  await conn.execute(
    `
      DELETE FROM cursos
      WHERE id = :id
    `,
    { id },
    { autoCommit: true }
  );

  await conn.close();
}
