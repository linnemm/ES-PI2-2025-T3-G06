import oracledb from "oracledb";
import { dbConfig } from "../config/database";

// ======================================================
// CRIAR CURSO
// ======================================================
export async function criarCurso(
  nome: string,
  sigla: string,
  coordenador: string,
  instituicaoId: number,
  usuarioId: number
) {
  const conn = await oracledb.getConnection(dbConfig);

  await conn.execute(
    `
      INSERT INTO cursos (nome, sigla, coordenador, instituicao_id, usuario_id)
      VALUES (:nome, :sigla, :coordenador, :instituicaoId, :usuarioId)
    `,
    { nome, sigla, coordenador, instituicaoId, usuarioId },
    { autoCommit: true }
  );

  await conn.close();
}

// ======================================================
// LISTAR CURSOS DE UMA INSTITUIÇÃO
// ======================================================
export async function buscarCursosPorInstituicao(instituicaoId: number) {
  const conn = await oracledb.getConnection(dbConfig);

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
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  await conn.close();
  return result.rows;
}

// ======================================================
// BUSCAR UM CURSO PELO ID
// ======================================================
export async function buscarCursoPorId(id: number) {
  const conn = await oracledb.getConnection(dbConfig);

  const result = await conn.execute(
    `
      SELECT
        id, nome, sigla, coordenador, instituicao_id, usuario_id
      FROM cursos
      WHERE id = :id
    `,
    { id },
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  await conn.close();
  return result.rows?.[0] || null;
}

// ======================================================
// EDITAR CURSO
// ======================================================
export async function editarCurso(
  id: number,
  nome: string,
  sigla: string,
  coordenador: string
) {
  const conn = await oracledb.getConnection(dbConfig);

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

// ======================================================
// VERIFICAR SE CURSO TEM DISCIPLINAS
// ======================================================
export async function cursoTemDisciplinas(id: number) {
  const conn = await oracledb.getConnection(dbConfig);

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
  return (result.rows as any)[0].TOTAL > 0;
}

// ======================================================
// EXCLUIR CURSO
// ======================================================
export async function excluirCurso(id: number) {
  const conn = await oracledb.getConnection(dbConfig);

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
